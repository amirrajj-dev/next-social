"use server";
import { connectToDb } from "@/utils/db/connectToDb";
import { getCurrentUserAction } from "./auth.actions";
import { IComment, IPost, IUser } from "@/types/types";
import { usersModel } from "@/utils/models/user.model";
import { postModel } from "@/utils/models/post.model";
import { commentModel } from "@/utils/models/comment.model";
import { notificationModel } from "@/utils/models/notification.model";
import { revalidatePath } from "next/cache";

export const createCommentAction = async (content: string, postId: string) => {
  try {
    await connectToDb();
    if (!content) {
      return { message: "content is not specified", success: false };
    }
    if (!postId) {
      return { message: "post id is not specified", success: false };
    }
    const commentedPost: IPost = (await postModel.findById(postId)) as IPost;
    if (!commentedPost) {
      return { message: "post not found", success: false };
    }
    const user: IUser = (await getCurrentUserAction()).data;

    const newComment = {
      content: content,
      author: user._id,
      post: postId,
    };
    const comment = await commentModel.create(newComment);
    await postModel.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });
    await usersModel.findByIdAndUpdate(user._id, {
      $push: { comments: comment._id },
    });

    //sending notification to the user whose post get commented
    const post: IPost = (await postModel.findById(postId)) as IPost;
    if (user.username !== post.author.username) {
      //sending notification to the user
      const newNotification = new notificationModel({
        sender: user._id,
        receiver: post.author._id,
        type: "comment",
        message: `${user.fullname} commented on your post`,
        comment : comment._id,
        post: post._id,
      });
      await newNotification.save();
      //update the post author's notifications
      await usersModel.findByIdAndUpdate(post.author._id, {
        $push: { notifications: newNotification._id },
      })
    }

    revalidatePath("/");
    return { message: "comment created successfully", success: true };
  } catch (error) {
    return { message: "error creating comment", error, success: false };
  }
};

export const deleteCommentAction = async (commentId: string) => {
  try {
    await connectToDb();
    if (!commentId) {
      return { message: "comment id is not specified", success: false };
    }
    const comment: IComment = (await commentModel.findById(
      commentId
    )) as IComment;
    if (!comment) {
      return { message: "comment not found", success: false };
    }
    const user: IUser = (await getCurrentUserAction()).data;
    // handling imposibble  scenario 😂👽💚
    if (comment.author._id.toString() !== user._id.toString()) {
      return {
        message: "you are not the author of this comment",
        success: false,
      };
    }

    const users : IUser[] = await usersModel.find({})
    users.forEach(user =>{
        user.likes = user.likes.filter(like => like.toString()!== comment._id.toString())
        user.save()
    })
    await commentModel.findByIdAndDelete(commentId);
    await postModel.findByIdAndUpdate(comment.post.toString(), {
      $pull: { comments: comment._id },
    });
    await usersModel.findByIdAndUpdate(user._id, {
      $pull: { comments: comment._id },
    }); 



    revalidatePath("/");
    return { message: "comment deleted successfully", success: true };

  } catch (error) {
    return { message: "error deleting comment", error, success: false };
  }
};


export const likeUnlikeCommentAction = async (commentId : string)=>{
    try {
        await connectToDb()
        const comment : IComment = (await commentModel.findById(commentId)) as IComment
        if(!comment){
            return { message: 'Comment not found', success: false }
        }
        const currentUser = (await getCurrentUserAction()).data
        const user : IUser = await usersModel.findById(currentUser._id) as IUser
        if (!user){
            return { message: 'User not logged in', success: false }
        }

        if(comment.likes.includes(currentUser._id)){
            comment.likes = comment.likes.filter(like => like.toString()!== currentUser._id.toString())
            await comment.save()
            user.likes = user.likes.filter(like=>like.toString()!== comment._id.toString())
            await user.save()
        } else {
          if (user._id.toString() !== comment.author.toString()){
            //sending notification
            const notification = new notificationModel({
              sender: user._id,
              type : 'like',
              receiver: comment.author.toString(),
              message: `${user.fullname} liked your comment`,
              comment : commentId
            })
            await notification.save()
            const userGetNotification = await usersModel.findById(comment.author)
            userGetNotification.notifications.push(notification._id)
            await userGetNotification.save()
          }
            comment.likes.push(currentUser._id)
            await comment.save()
            user.likes.push(comment._id)
            await user.save()

        }
        revalidatePath("/")
        return { message: 'Comment liked/unliked successfully', success: true }

    } catch (error) {
        return { message: 'Error liking/unliking comment', error, success: false }   
    }
}