"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import { IComment, IUser } from "@/types/types";
import { MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { createCommentAction } from "@/actions/comment.actions";
import { toast } from "@/hooks/use-toast";

const CommentsModal = ({
  comments,
  currentUser,
  commentsCount,
  postId,
}: {
  comments: IComment[];
  currentUser: IUser;
  commentsCount: number | undefined;
  postId: string;
}) => {
  const [newComment, setNewComment] = useState("");

  const handleSumbitComment = async () => {
    if (newComment.trim()) {
      const res = await createCommentAction(newComment, postId);
      console.log(res);
      if (res.success) {
        toast({
          title: "Comment created successfully",
          className: "bg-emerald-600",
        });
      } else {
        toast({
          title: "Failed to create comment",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-center gap-1">
        <MessageCircle className={`${commentsCount > 0 ? 'text-blue-500 fill-current' : null }`} size={20} />
        {commentsCount}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Comments</DialogTitle>
        <div className="max-h-[400px] overflow-y-auto p-2">
          <div className="flex gap-4 mb-4">
            <Avatar className="mt-6 w-10 h-10">
              <AvatarImage src={currentUser.img} alt={currentUser.username} />
              <AvatarFallback>
                {currentUser.fullname.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col gap-3 items-end">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="h-20 border border-gray-300 rounded-md p-2"
              />
              <Button onClick={handleSumbitComment}>
                <span>Post</span>
                <Send className="translate-y-[2px]" />
              </Button>
            </div>
          </div>
          {comments?.length > 0 ? (
            comments.map((comment, index) => (
              <div
                key={index}
                className="flex gap-4 mb-4 p-4 border-b border-gray-300"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.author.img} alt={comment.author.username} />
                  <AvatarFallback>
                    {comment.author.fullname.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="block font-semibold text-gray-500">
                    {comment.author.username}
                  </span>
                  <p className="text-gray-200">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No comments yet. Be the first to comment!</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsModal;