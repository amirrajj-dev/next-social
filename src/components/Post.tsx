import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import Image from "next/image";
import { IUser, IPost } from "@/types/types";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import PostLikeBtn from "./PostLikeBtn";
import DeletePostModal from "./DeletePostModal";
import CommentsModal from "./CommentsModal";

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
                <AvatarFallback>
                  {post.author.fullname.slice(0, 2)}
                </AvatarFallback>
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
            width={600}
            height={400}
            layout="responsive"
          />
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <PostLikeBtn
              likeCount={post.likeCount}
              postId={post._id.toString()}
              userId={post.author._id.toString()}
              currentUser={currentUser}
            />
            <div className="flex items-center dark:text-neutral-400 text-neutral-950 transition duration-200 hover:dark:text-blue-500 hover:text-blue-500 hover:scale-105">
              <CommentsModal postId={post._id.toString()} commentsCount={post.commentCount} currentUser={currentUser} comments={JSON.parse(JSON.stringify(post.comments))}/>
            </div>
          </div>
          {String(currentUser?._id) === String(post.author?._id) && (
            <div className="absolute top-3 right-5">
              <DeletePostModal postId={post._id.toString()} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Post;
