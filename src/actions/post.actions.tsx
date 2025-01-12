'use server'

import { connectToDb } from "@/utils/db/connectToDb";
import { postModel } from "@/utils/models/post.model";
import { IPost, IUser } from "@/types/types";
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { usersModel } from "@/utils/models/user.model";
import { revalidatePath } from "next/cache";
import { getCurrentUserAction } from "./auth.actions";
import { notificationModel } from "@/utils/models/notification.model";
import { commentModel } from "@/utils/models/comment.model";

export const createPostAction = async (post: FormData) => {
    try {
        await connectToDb();

        const entries = Object.fromEntries(post);
        const content = entries.content as string;
        const author = entries.author as string;
        const image = entries.image as File;

        const currentUser : IUser = (await getCurrentUserAction()).data

        if (!content || !author) {
            return { message: 'Each post should contain author and content', success: false };
        }

        const user: IUser | null = await usersModel.findOne({ fullname: author }).exec();
        if (!user) {
            return { message: 'User not found', success: false };
        }

        const postObj: Partial<IPost> = {
            author: user._id,
            content: content,
        };

        if (image) {
            const imageData = Buffer.from(await image.arrayBuffer());
            const uploadDir = path.join(process.cwd(), 'public', 'posts');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const uniqueFilename = `${crypto.randomUUID()}-${image.name}`;
            const filePath = path.join(uploadDir, uniqueFilename);

            fs.writeFileSync(filePath, imageData);

            postObj.image = `/posts/${uniqueFilename}`;
        }

        const newPost = new postModel(postObj);
        await newPost.save();
        await usersModel.findOneAndUpdate({username : currentUser.username} , {
            $push : {
                posts : newPost._id
            }
        })
        revalidatePath('/')

        return { message: 'Post created successfully', success: true };
    } catch (error) {
        return { message: 'Error creating post', error: error, success: false };
    }
};

export const getAllPostsAction = async () => {
    try {
        await connectToDb()
        const posts = await postModel.find({}).populate('author' , 'fullname username img').populate({
            path : 'comments',
            populate : {
                path : 'author',
                select : 'username img fullname'
            }
        }).sort({_id : -1})
        return { data : posts, success: true };
    } catch (error) {
        return { message: 'Error getting posts', error: error, success: false };
    }
}

export const likeUnlikePostAction = async (postId : string , userId : string)=>{
    try {
        await connectToDb()
        const post = await postModel.findById(postId).exec()
        const userWhichPostgetsLiked = await usersModel.findById(userId).exec()
        if(!post){
            return { message: 'Post not found', success: false }
        }
        const currentuser = (await getCurrentUserAction()).data
        if(!currentuser){
            return { message: 'User not logged in', success: false }
        }
        const user = await usersModel.findById({_id : currentuser._id})

        if(post.likes.includes(currentuser._id)){
            post.likes = post.likes.filter(like => like.toString() !== currentuser._id.toString())
            await post.save()
            user.likes = user.likes.filter(like=>like.toString() !== post._id.toString())
            await user.save()
            
            //sending notification to the user which post gets liked
        } else{
            post.likes.push(currentuser._id)
            await post.save()
            user.likes.push(post._id)
            await user.save()
            if (user._id.toString() !== userWhichPostgetsLiked._id.toString()){
                const newNotification = new notificationModel({
                    sender: user._id,
                    receiver: userWhichPostgetsLiked._id,
                    type: "like",
                    message: `${currentuser.fullname} liked your post`,
                    post : post._id
                });
                await newNotification.save()
                userWhichPostgetsLiked.notifications.push(newNotification._id)
                await userWhichPostgetsLiked.save()
            }
        }
        revalidatePath('/')
        return { message: 'Post liked/unliked successfully', success: true };
    } catch (error) {
        return { message: 'Error liking/unliking post', error: error, success: false };
    }
}

export const deletePostAction = async (postId: string) => {
    try {
      await connectToDb();
  
      const post: IPost = await postModel.findById(postId).exec();
      const currentUser: IUser = (await getCurrentUserAction()).data;
  
      if (!post) {
        return { message: 'Post not found', success: false };
      }
  
      // Fetch all comments related to the post
      const commentsToDelete = await commentModel.find({ post: postId }).exec();
  
      // Deleting the post from the database
      await postModel.findByIdAndDelete(postId);
  
      // Iterate through all users and remove related comments
      const users = await usersModel.find().exec();
  
      for (const user of users) {
        // Remove the postId from user likes if it exists
        if (user.likes.includes(postId)) {
          user.likes = user.likes.filter(like => like.toString() !== postId.toString());
        }
  
        // Remove all comments related to the post from user comments
        user.comments = user.comments.filter(userComment => 
          !commentsToDelete.some(comment => comment._id.toString() === userComment.toString())
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
  
      revalidatePath('/');
      return { message: 'Post deleted successfully', success: true };
    } catch (error) {
      return { message: 'Error deleting post', error: error, success: false };
    }
  };
  
  