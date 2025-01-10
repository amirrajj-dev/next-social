// types.ts

import mongoose, { Types } from "mongoose";

// User Interface
export interface IUser {
  _id: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  password: string;
  username: string;
  img?: string;
  gender: "male" | "female";
  bio?: string;
  location?: string;
  posts: Types.ObjectId[];
  comments: Types.ObjectId[];
  likes: Types.ObjectId[];
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  notifications: Types.ObjectId[];
}

// Post Interface
export interface IPost {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: IUser;
  image?: string;
  likes: Types.ObjectId[];
  comments: IComment[];
  notifications: Types.ObjectId[];
  likeCount?: number; // Virtual field
  commentCount?: number; // Virtual field
  createdAt : Date
}

// Notification Interface
export interface INotification {
  type: "like" | "comment" | "follow";
  receiver: Types.ObjectId;
  sender: Types.ObjectId;
  post?: Types.ObjectId;
  comment?: Types.ObjectId;
  message: string;
  read: boolean;
}

// Like Interface
export interface ILike {
  user: Types.ObjectId;
  post: Types.ObjectId;
}

// Comment Interface
export interface IComment {
  _id : mongoose.Types.ObjectId;
  content: string;
  author: IUser;
  post: Types.ObjectId;
  likes: Types.ObjectId[];
  replies: Types.ObjectId[];
  likeCount?: number; // Virtual field
  replyCount?: number; // Virtual field
}
