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
            const newNotification = new notificationModel({
                sender: user._id,
                receiver: userWhichPostgetsLiked._id,
                type: "like",
                message: `${currentuser.fullname} liked your post`,
                post : post._id
            });
            await newNotification.save()
        } else{
            post.likes.push(currentuser._id)
            await post.save()
            user.likes.push(post._id)
            await user.save()
        }
        revalidatePath('/')
        return { message: 'Post liked/unliked successfully', success: true };
    } catch (error) {
        return { message: 'Error liking/unliking post', error: error, success: false };
    }
}

export const deletePostAction = async (postId : string)=>{
    try {
        await connectToDb()
        const post : IPost = await postModel.findById(postId).exec()
        const currentUser : IUser = (await getCurrentUserAction()).data
        if(!post){
            return { message: 'Post not found', success: false }
        }
        await postModel.findByIdAndDelete(postId)
        //deleting the post from all users likes if it exists in their likes array
        const users = await usersModel.find().exec()

        users.forEach(user => {
            if(user.likes.includes(postId)){
                user.likes = user.likes.filter(like => like.toString() !== postId.toString())
                user.save()
            }
        }) 

        await usersModel.findOneAndUpdate({username : currentUser.username} , {
            $pull: { posts: post._id }
        })
        
        revalidatePath('/')
        return { message: 'Post deleted successfully', success: true };
    } catch (error) {
        return { message: 'Error deleting post', error: error, success: false };
    }
}