"use server";
import { connectToDb } from "@/utils/db/connectToDb";
import { postModel } from "@/utils/models/post.model";
import { IPost, IUser } from "@/types/types";
import path from "path";
import fs from "fs";
import { usersModel } from "@/utils/models/user.model";
import { revalidatePath } from "next/cache";
import { getCurrentUserAction } from "./auth.actions";
import { notificationModel } from "@/utils/models/notification.model";
import { commentModel } from "@/utils/models/comment.model";
import mongoose from "mongoose";
import { uploadImageToCloudinary } from "@/utils/cloudinary/cloudinary";

export const createPostAction = async (post: FormData) => {
  try {
    await connectToDb();

    const entries = Object.fromEntries(post);
    const content = entries.content as string;
    const author = entries.author as string;
    const image = post.get("image") as File;

    const currentUser = (await getCurrentUserAction())?.data;

    if (!content || !author) {
      return {
        message: "Each post should contain author and content.",
        success: false,
      };
    }

    const user = await usersModel.findOne({ fullname: author }).exec();
    if (!user) {
      return { message: "User not found.", success: false };
    }

    const postObj: Partial<IPost> = {
      author: user._id,
      content: content,
    };

    if (image) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const MAX_SIZE_MB = 1 * 1_000_000; // 1 MB in bytes
      if (image.size > MAX_SIZE_MB) {
        return { message: "Image size exceeds 1MB.", success: false };
      }
      // Upload image buffer directly to Cloudinary
      const uploadResult = await uploadImageToCloudinary(
        imageBuffer,
        "post_images"
      );
      postObj.image = uploadResult.secure_url;
    }

    const newPost = new postModel(postObj);
    await newPost.save();

    await usersModel.findOneAndUpdate(
      { username: currentUser.username },
      { $push: { posts: newPost._id } }
    );

    revalidatePath("/");

    return { message: "Post created successfully.", success: true };
  } catch (error) {
    return { message: "Error creating post.", error, success: false };
  }
};

export const getAllPostsAction = async () => {
  try {
    await connectToDb();
    const posts = await postModel
      .find({})
      .populate("author", "fullname username img")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username img fullname",
        },
      })
      .sort({ _id: -1 });
    return { data: posts, success: true };
  } catch (error) {
    return { message: "Error getting posts.", error: error, success: false };
  }
};

export const likeUnlikePostAction = async (postId: string, userId: string) => {
  try {
    await connectToDb();
    const post = await postModel.findById(postId).exec();
    const userWhichPostgetsLiked = await usersModel.findById(userId).exec();
    if (!post) {
      return { message: "Post not found.", success: false };
    }
    const currentUser = (await getCurrentUserAction())?.data;
    if (!currentUser) {
      return { message: "User not logged in.", success: false };
    }
    const user = await usersModel.findById({ _id: currentUser._id });

    if (post.likes.includes(currentUser._id)) {
      post.likes = post.likes.filter(
        (like: mongoose.Types.ObjectId) =>
          like.toString() !== currentUser._id.toString()
      );
      await post.save();
      user.likes = user.likes.filter(
        (like: mongoose.Types.ObjectId) =>
          like.toString() !== post._id.toString()
      );
      await user.save();

      //sending notification to the user which post gets liked
    } else {
      post.likes.push(currentUser._id);
      await post.save();
      user.likes.push(post._id);
      await user.save();
      if (user._id.toString() !== userWhichPostgetsLiked._id.toString()) {
        const newNotification = new notificationModel({
          sender: user._id,
          receiver: userWhichPostgetsLiked._id,
          type: "like",
          message: `${currentUser.fullname} liked your post.`,
          post: post._id,
        });
        await newNotification.save();
        userWhichPostgetsLiked.notifications.push(newNotification._id);
        await userWhichPostgetsLiked.save();
      }
    }
    revalidatePath("/");
    return { message: "Post liked/unliked successfully.", success: true };
  } catch (error) {
    return {
      message: "Error liking/unliking post.",
      error: error,
      success: false,
    };
  }
};

export const deletePostAction = async (postId: string) => {
  try {
    await connectToDb();

    const post: IPost = await postModel.findById(postId).exec();
    const currentUser: IUser = (await getCurrentUserAction())?.data;

    if (!post) {
      return { message: "Post not found.", success: false };
    }

    // Fetch all comments related to the post
    const commentsToDelete = await commentModel.find({ post: postId }).exec();

    // Deleting the post from the database
    await postModel.findByIdAndDelete(postId);

    // Remove post image from public/posts directory if exists
    if (post.image) {
      const imagePath = path.join(process.cwd(), "public", post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Iterate through all users and remove related comments
    const users = await usersModel.find().exec();

    for (const user of users) {
      // Remove the postId from user likes if it exists
      if (user.likes.includes(postId)) {
        user.likes = user.likes.filter(
          (like: mongoose.Types.ObjectId) =>
            like.toString() !== postId.toString()
        );
      }

      // Remove all comments related to the post from user comments
      user.comments = user.comments.filter(
        (userComment: mongoose.Types.ObjectId) =>
          !commentsToDelete.some(
            (comment) => comment._id.toString() === userComment.toString()
          )
      );

      await user.save();
    }

    // Deleting all comments related to the post
    for (const comment of commentsToDelete) {
      await commentModel.findByIdAndDelete(comment._id);
    }

    // Update current user's posts
    await usersModel.findOneAndUpdate(
      { username: currentUser.username },
      { $pull: { posts: post._id } }
    );

    revalidatePath("/");
    return { message: "Post deleted successfully.", success: true };
  } catch (error) {
    return { message: "Error deleting post.", error: error, success: false };
  }
};
