'use server'

import { usersModel } from "@/utils/models/user.model"
import { getCurrentUserAction } from "./auth.actions"
import { IUser } from "@/types/types"
import { postModel } from "@/utils/models/post.model"
import mongoose from "mongoose"
import { connectToDb } from "@/utils/db/connectToDb"

export const getUserPostsAction = async (userId : mongoose.Types.ObjectId)=>{
    try {
        await connectToDb()
        const user : IUser = await usersModel.findById(userId) as IUser
        const UserPosts = await postModel.find({author : user._id}).populate([
            {path: 'author', select: 'fullname img'},
            //populating author of comments field
            {path: 'comments' , populate : {
                path: 'author' , select: 'fullname img username fullname'
            }},
        ])
        return {message :'user Posts fetched succesfully' , data : UserPosts , success : true}
    } catch (error) {
        return {message :'Error fetching user posts' , error , success : false}
    }
}

export const getUserLikedPostsAction = async (userId : mongoose.Types.ObjectId)=>{
    try {
        await connectToDb()
        const user : IUser = await usersModel.findById(userId) as IUser
        const likedPosts = await postModel.find({likes : user._id}).populate([
            {path: 'author', select: 'fullname img'},
            //populating author of comments field
            {path: 'comments' , populate : {
                path: 'author' , select: 'fullname img username fullname'
            }},
        ])
        return {message :'user liked posts fetched succesfully' , data : likedPosts , success : true}
    } catch (error) {
        return {message :'Error fetching user liked posts' , error , success : false}
    }
}