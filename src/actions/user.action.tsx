'use server'

import { connectToDb } from "@/utils/db/connectToDb";
import { usersModel } from "@/utils/models/user.model";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export const getUsersToFollow = async () => {
    try {
        await connectToDb();
        const cookiesStore = await cookies();
        const token = cookiesStore.get('next-social-token')?.value;

        // Decode token for email
        const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
        const user = await usersModel.findOne({ email: decodedToken.email });

        // Getting 3 random users to follow except the current user
        const usersToFollow = await usersModel.aggregate([
            { $match: { _id: { $ne: user._id } } }, // Exclude the current user
            { $sample: { size: 3 } }, // Randomly select 3 users
            { 
                $project: {
                    _id: 1, // Keep _id for unique key
                    username: 1,
                    img: 1,
                    fullname: 1,
                    followers: { $size: "$followers" } // Calculate followers count
                }
            }
        ]);

        if (usersToFollow.length > 0) {
            return { message: 'Users to follow except the current user :)', success: true, data: usersToFollow };
        } else {
            return { message: 'No users to follow except the current user :(', success: true, data: [] };
        }

    } catch (error) {
        return { message: 'Error getting users to follow', success: false, error };
    }
};