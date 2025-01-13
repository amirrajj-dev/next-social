import { getCurrentUserAction } from "@/actions/auth.actions";
import { getAllPostsAction } from "@/actions/post.actions";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Post from "./Post";
import { Button } from "./ui/button";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";

const Posts = async () => {
  const currentUser = (await getCurrentUserAction())?.data;
  const posts = (await getAllPostsAction()).data;

  if (!currentUser) {
    return (
      <Card className="p-4 sm:p-6 shadow-lg rounded-lg text-center mt-4">
        <CardHeader>
          <CardTitle>
            <h2 className="font-bold dark:text-neutral-100 text-neutral-900 text-2xl">
              Welcome!
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-800 dark:text-neutral-200 mb-4">
            You need to be logged in to see the posts.
          </p>
          <Link href={"/signin"}>
            <Button size={"lg"}>Log In</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="flex flex-col gap-3 mt-4 overflow-auto">
        {posts?.map((post, index) => (
          <Post post={post} currentUser={currentUser} key={index + 1} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default Posts;
