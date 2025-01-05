"use server";

const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

import { usersModel } from "@/utils/models/user.model";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDb } from "@/utils/db/connectToDb";
import { generateRefreshToken } from "@/utils/helper/generateRefreshToke";
import { refreshTokenModel } from "@/utils/models/refreshToken.model";

const boyImages = ["boy1.png", "boy2.png", "boy3.png"];
const girlImages = ["girl.png", "girl2.png", "girl3.png"];

export const signUpAction = async (formdata: FormData) => {
  try {
    await connectToDb();
    const entries = Object.fromEntries(formdata);
    const fullname = entries.fullname as string;
    const email = entries.email as string;
    const password = entries.password as string;
    const gender = entries.gender as string;

    if (!fullname || !email || !password || !gender) {
      return { message: "Please fill all fields", success: false };
    }

    const user = await usersModel.findOne({ email });
    if (user) {
      return { message: "User already exists", success: false };
    }

    if (password.length < 8) {
      return {
        message: "Password must be at least 8 characters long",
        success: false,
      };
    }

    if (!emailRegex.test(email)) {
      return { message: "Invalid email address or format", success: false };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = await jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Adding user token to cookies
    const cookiesStore = await cookies();
    cookiesStore.set("next-social-token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "strict",
      secure: true,
    });

    // Adding user to database
    await usersModel.create({
      fullname,
      email,
      gender,
      password: hashedPassword,
      img: `/avatars/${
        gender === "male"
          ? boyImages[Math.floor(Math.random() * boyImages.length)]
          : girlImages[Math.floor(Math.random() * girlImages.length)]
      }`,
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    // Convert error object to plain object
    const plainError = JSON.parse(JSON.stringify(error));
    return {
      message: "Error creating user",
      success: false,
      error: plainError,
    };
  }
};

export const signInAction = async (formdata: FormData) => {
  try {
    await connectToDb();
    const entries = Object.fromEntries(formdata);
    const email = entries.email as string;
    const password = entries.password as string;
    
    const user = await usersModel.findOne({ email });
    if (!user) {
      return { message: "User not found", success: false };
    }

    //check if password is valid
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { message: "Invalid password", success: false };
    }

    const token = await jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    const cookiesStore = await cookies();
    cookiesStore.set("next-social-token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "strict",
      secure: true,
    });

    //handling users refresh token
    const refreshToken = await generateRefreshToken(user._id);
    cookiesStore.set("next-social-refresh-token", refreshToken.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "strict",
      secure: true,
    });

    return { success: true, message: "User signed in successfully" };
  } catch (error) {
    const plainError = JSON.parse(JSON.stringify(error));
    return {
      message: "Error signing in user",
      success: false,
      error: plainError,
    };
  }
};

export const getCurrentUserAction = async () => {
  try {
    await connectToDb();
    const cookiesStore = await cookies();
    const token = cookiesStore.get("next-social-token")?.value as string;
    if (!token) {
      return { success: false, message: "No token found" };
    }
    const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await usersModel.findOne(
      { email: decodedToken.email },
      "fullname email img"
    );
    if (!user) {
      return { success: false, message: "User not found" };
    }
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return {
      message: "error getting current user",
      success: false,
      error: error,
    };
  }
};

export const refreshTokenAction = async () => {
    try {
      await connectToDb();
      const cookiesStore = await cookies();
      const token = cookiesStore.get("next-social-refresh-token")?.value;
      if (!token) {
        return ({ message: "No refresh token found" , success: false});
      }
      const refreshToken = await refreshTokenModel.findOne({ token }).populate({
        path : 'userId',
        select : 'email'
      });
      if (!refreshToken || refreshToken.expiryDate < new Date()) {
        return { message: "Invalid or expired refresh token" , success : false };
      }
      const newAccessToken = jwt.sign({ email: refreshToken.userId.email }, process.env.SECRET_KEY, { expiresIn: "1h" });
      const newRefreshToken = await generateRefreshToken(refreshToken.userId._id);
  
      cookiesStore.set("next-social-token", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60, // 1 hour
        path: "/",
        sameSite: "strict",
        secure: true,
      });
      cookiesStore.set("next-social-refresh-token", newRefreshToken.token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "strict",
        secure: true,
      });
  
      return { success: true, accessToken: newAccessToken };
    } catch (error) {
      return { message: "Error refreshing token", error };
    }
  };  

  export const signOutAction = async ()=>{
    try {
      await  connectToDb()
      const cookiesStore = await cookies();
      cookiesStore.delete("next-social-token")
      cookiesStore.delete("next-social-refresh-token")
      return { success: true , message : 'logged  out succesfully' }
    } catch (error) {
      return { message: "Error signing out", error }
    }
  }