'use client';
import { likeUnlikePostAction } from "@/actions/post.actions";
import { IUser } from "@/types/types";
import { Heart } from "lucide-react";
import React from "react";
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const PostLikeBtn = ({ likeCount, postId, userId, currentUser }: { likeCount: number | undefined; postId: string; userId: string; currentUser: IUser }) => {
  const [liked, setLiked] = React.useState(currentUser.likes.some((like: mongoose.Types.ObjectId) => like.toString() === postId.toString()));

  const onClickHandler = async (postId: string, userId: string) => {
    await likeUnlikePostAction(postId, userId);
    setLiked(!liked);
  };

  return (
    <button className="flex items-center dark:text-neutral-400 text-neutral-950 transition duration-200 hover:dark:text-red-500 hover:text-red-500 hover:scale-105" onClick={() => onClickHandler(postId, userId)}>
      <Heart className={`mr-1 w-4 h-4 ${liked ? 'text-red-500 fill-current' : ''}`} />  {/* Apply fill color if liked */}
      {likeCount}
    </button>
  );
};

export default PostLikeBtn;