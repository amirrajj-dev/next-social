"use server";

import { connectToDb } from "@/utils/db/connectToDb";
import { usersModel } from "@/utils/models/user.model";
import { notificationModel } from "@/utils/models/notification.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import { IUser } from "@/types/types";

export const getUsersToFollow = async () => {
  try {
    await connectToDb();
    const cookiesStore = await cookies();
    const token = cookiesStore.get("next-social-token")?.value;

    // Decode token for email
    const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
    const currentUser = await usersModel.findOne({ email: decodedToken.email });

    // Getting users excluding the current user
    const users : IUser[] = await usersModel.find({});
    const suggestedUsers = users.filter(
      (user) =>
        String(user._id) !== String(currentUser._id) &&
        !currentUser.following.includes(user._id)
    );

    // Shuffle the list of suggested users
    const shuffleArray = (array : IUser[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    // Shuffle and select 3 random users
    shuffleArray(suggestedUsers);
    const randomSuggestedUsers = suggestedUsers.slice(0, 3);

    return {
      message: "Users to follow except the current user :)",
      success: true,
      data: randomSuggestedUsers,
    };
  } catch (error) {
    return { message: "Error getting users to follow", success: false, error };
  }
};


export const followUnfollowUser = async (username: string) => {
  try {
    await connectToDb();
    const cookiesStore = await cookies();
    const token = cookiesStore.get("next-social-token")?.value;
    if (!token) {
      return {
        message: "You must be logged in to follow/unfollow a user",
        success: false,
      };
    }
    const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await usersModel.findOne({ email: decodedToken.email });
    const userToFollow = await usersModel.findOne({ username: username });
    if (!userToFollow) {
      return { message: "User not found", success: false };
    }
    if (userToFollow._id.equals(user._id)) {
      return { message: "You can't follow yourself", success: false };
    }
    // Check if user is already following the user to follow
    const isFollowing = user.following.includes(userToFollow._id);
    if (isFollowing) {
      // Unfollow user
      await usersModel.updateOne(
        { _id: user._id },
        {
          $pull: {
            following: userToFollow._id,
          },
        }
      );
      await usersModel.updateOne(
        { _id: userToFollow._id },
        {
          $pull: {
            followers: user._id,
          },
        }
      );
      revalidatePath("/");
      return { message: "user unfollowed succesfully", success: true };
    }
    // Follow user
    await usersModel.updateOne(
      { _id: user._id },
      {
        $push: {
          following: userToFollow._id,
        },
      }
    );
    await usersModel.updateOne(
      { _id: userToFollow._id },
      {
        $push: {
          followers: user._id,
        },
      }
    );

    //handle sending notification to user which get followed
    const newNotification = new notificationModel({
      sender: user._id,
      receiver: userToFollow._id,
      type: "follow",
      message: `${user.fullname} started following you`,
    });
    await newNotification.save();

    //push the new notification in user who get followed notifications
    userToFollow.notifications.push(newNotification._id)
    await userToFollow.save();

    revalidatePath("/");
    return { message: "user followed succesfully", success: true };
  } catch (error) {
    return {
      message: "Error following/unfollowing user",
      success: false,
      error,
    };
  }
};