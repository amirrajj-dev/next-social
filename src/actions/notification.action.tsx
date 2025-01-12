'use server'

import { connectToDb } from "@/utils/db/connectToDb"
import { getCurrentUserAction } from "./auth.actions"
import { usersModel } from "@/utils/models/user.model"
import { IUser } from "@/types/types"
import { notificationModel } from "@/utils/models/notification.model"

export const getNotificationsAction = async ()=>{
    try {
        await connectToDb()
        const currentUser : IUser = (await getCurrentUserAction()).data
        const user : IUser = await usersModel.findById(currentUser._id) as IUser

        const userNotifications = await notificationModel.find({ receiver: user._id }).populate([
            {
                path: 'sender',
                select : 'img fullname',
                
            },
            {
                path : 'post',
                select : 'content image',
            },
            {
                path : 'comment',
                select : 'content img post',
                populate : {
                    path : 'post',
                    select : 'content image',
                }
            }
        ]).sort({_id : -1})

      
        return {message : 'notifications fetched successfully' , success : true , data : userNotifications}
    } catch (error) {
        return {message : 'error fetching notifications' , success : false , error}
    }
} 