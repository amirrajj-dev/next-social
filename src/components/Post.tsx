import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import Image from "next/image";
import { IUser, IPost } from "@/types/types";
import { MessageCircle, Trash2, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Post = ({
  post,
  currentUser,
}: { post: IPost } & { currentUser: IUser }) => {

  return (
    <Card className="p-1.5 shadow-lg rounded-lg relative">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.author.img} />
                <AvatarFallback>{post.author.fullname.slice(0,2)}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="font-bold dark:text-neutral-100 text-neutral-900 text-lg">
                  {post?.author.fullname}
                </span>
                <span className="text-sm dark:text-neutral-400 text-neutral-600">
                  @{post?.author.username}
                </span>
              </div>
            </div>
            <div className="text-sm dark:text-neutral-400 text-neutral-600 mt-2 sm:mt-0">
              {moment(post.createdAt).fromNow()}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-800 dark:text-neutral-200 mb-3 text-justify">
          {post?.content}
        </p>
        {post?.image && (
          <Image
            src={post.image}
            alt="Post image"
            className="rounded-md"
            width={600} // Adjusted width based on your layout
            height={400} // Adjusted height based on your layout
            layout="responsive"
          />
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <button className="flex items-center dark:text-neutral-400 text-neutral-950 transition duration-200 hover:dark:text-red-500 hover:text-red-500 hover:scale-105">
              <Heart className="mr-1 w-4 h-4 " /> {post.likeCount}
            </button>
            <button className="flex items-center dark:text-neutral-400 text-neutral-950 transition duration-200 hover:dark:text-blue-500 hover:text-blue-500 hover:scale-105">
              <MessageCircle className="mr-1 w-4 h-4" /> {post.commentCount}
            </button>
          </div>
          {String(currentUser?._id) === String(post.author?._id) && (
            <button className="flex items-center dark:text-neutral-50 text-neutral-950 absolute top-4 right-5">
              <Trash2 className="mr-1 w-4 h-4" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Post;