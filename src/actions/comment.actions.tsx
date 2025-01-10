'use server'
import { connectToDb } from "@/utils/db/connectToDb"
import { getCurrentUserAction } from "./auth.actions"
import { IPost, IUser } from "@/types/types"
import { usersModel } from "@/utils/models/user.model"
import { postModel } from "@/utils/models/post.model"
import { commentModel } from "@/utils/models/comment.model"
import { revalidatePath } from "next/cache"

export const createCommentAction = async (content : string , postId : string)=>{
    try {
        await connectToDb()
        if (!content){
            return {message : 'content is not specified' , success : false}
        }
        if (!postId){
            return {message : 'post id is not specified' , success : false}
        }
        const commentedPost : IPost = await postModel.findById(postId) as IPost
        if (!commentedPost){
            return {message : 'post not found' , success : false}
        }
        const user : IUser = (await getCurrentUserAction()).data

        const newComment = {
            content : content ,
            author : user._id,
            post : postId
        }
        const comment = await commentModel.create(newComment)
        await postModel.findByIdAndUpdate(postId , { $push : { comments : comment._id } })
        await usersModel.findByIdAndUpdate(user._id , {$push : {comments : comment._id}})
        
        revalidatePath('/')
        return {message : 'comment created successfully' , success : true}
    } catch (error) {
        return {message : 'error creating comment' , error , success : false }
    }
}