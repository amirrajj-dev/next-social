"use server";

import { usersModel } from "@/utils/models/user.model";
import { IUser } from "@/types/types";
import { postModel } from "@/utils/models/post.model";
import mongoose from "mongoose";
import { connectToDb } from "@/utils/db/connectToDb";
import path from "path";
import fs, { writeFileSync } from "fs";
import { revalidatePath } from "next/cache";

export const getUserPostsAction = async (userId: mongoose.Types.ObjectId) => {
  try {
    await connectToDb();
    const user: IUser = (await usersModel.findById(userId)) as IUser;
    const UserPosts = await postModel.find({ author: user._id }).populate([
      { path: "author", select: "fullname img username" },
      //populating author of comments field
      {
        path: "comments",
        populate: {
          path: "author",
          select: "fullname img username fullname",
        },
      },
    ]);
    return {
      message: "user Posts fetched succesfully",
      data: UserPosts,
      success: true,
    };
  } catch (error) {
    return { message: "Error fetching user posts", error, success: false };
  }
};

export const getUserLikedPostsAction = async (
  userId: mongoose.Types.ObjectId
) => {
  try {
    await connectToDb();
    const user: IUser = (await usersModel.findById(userId)) as IUser;
    const likedPosts = await postModel.find({ likes: user._id }).populate([
      { path: "author", select: "fullname img username" },
      //populating author of comments field
      {
        path: "comments",
        populate: {
          path: "author",
          select: "fullname img username fullname",
        },
      },
    ]);
    return {
      message: "user liked posts fetched succesfully",
      data: likedPosts,
      success: true,
    };
  } catch (error) {
    return {
      message: "Error fetching user liked posts",
      error,
      success: false,
    };
  }
};

export const updateProfileAction = async (formdata: FormData, username: string) => {
  try {
    await connectToDb();
    const entries = Object.fromEntries(formdata);
    if (Object.keys(entries).length === 0) {
      return { message: "No data to update", success: false };
    }
    const fullname = entries.fullname as string;
    const bio = entries.bio as string;
    const location = entries.location as string;
    const img = entries.img as File;
    const user : IUser = await usersModel.findOne({ username });
    if (!user) {
      return { message: "User not found", success: false };
    }

    if (img && img.size > 0) {
      if (user.img && !user.img.startsWith('/avatars')) {
        const imagePath = path.join(process.cwd(), "public", user.img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      const imageData = Buffer.from(await img.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public", "profiles");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFilename = `${crypto.randomUUID()}-${img.name}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      fs.writeFileSync(filePath, imageData);
      user.img = `/profiles/${uniqueFilename}`;
    }
    user.fullname = fullname;
    user.bio = bio;
    user.location = location;
    await user.save();
    revalidatePath("/profile");
    revalidatePath('/')
    return { message: "Profile updated succesfully", success: true };
  } catch (error) {
    return { message: "Error updating profile", error, success: false };
  }
};