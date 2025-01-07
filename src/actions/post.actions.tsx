'use server'

import { connectToDb } from "@/utils/db/connectToDb";
import { postModel } from "@/utils/models/post.model";
import { IPost, IUser } from "@/types/types";
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { usersModel } from "@/utils/models/user.model";
import { revalidatePath } from "next/cache";

export const createPost = async (post: FormData) => {
    try {
        await connectToDb();

        const entries = Object.fromEntries(post);
        const content = entries.content as string;
        const author = entries.author as string;
        const image = entries.image as File;

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
        revalidatePath('/')

        return { message: 'Post created successfully', success: true };
    } catch (error) {
        return { message: 'Error creating post', error: error, success: false };
    }
};