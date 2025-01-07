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
  content: string;
  author: Types.ObjectId;
  image?: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  notifications: Types.ObjectId[];
  likeCount?: number; // Virtual field
  commentCount?: number; // Virtual field
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
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  likes: Types.ObjectId[];
  replies: Types.ObjectId[];
  likeCount?: number; // Virtual field
  replyCount?: number; // Virtual field
}
