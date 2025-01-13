import Navbar from "@/components/Navbar";
import { IPost, IUser } from "@/types/types";
import { usersModel } from "@/utils/models/user.model";
import { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import SideBarCard from "@/components/SideBarCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarCheck, MapPin } from "lucide-react";
import {
  getUserLikedPostsAction,
  getUserPostsAction,
} from "@/actions/profile.action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Post from "@/components/Post";
import { Image as ImageI, Heart } from "lucide-react";
import { getCurrentUserAction } from "@/actions/auth.actions";
import ProfileFollowUnfollowBtn from "@/components/ProfileFollowUnfollowBtn";
import EditProfileModal from "@/components/EditProfileModal";

type Props = {
  params: Promise<{ username: string }>;
};

const page = async ({ params }: Props) => {
  const username = (await params).username;
  const user: IUser = await usersModel.findOne({ username }).exec();
  if (!user) notFound();
  const currentUser = (await getCurrentUserAction())?.data;
  const userPosts: IPost[] = (await getUserPostsAction(user._id))
    .data as IPost[];
  const userLikedPosts: IPost[] = (await getUserLikedPostsAction(user._id))
    .data as IPost[];

  // format data with month and year
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(new Date(user.createdAt));


  return (
    <div>
      <Navbar />
      <div className="max-w-7xl py-8 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="col-span-1 lg:col-span-3 rounded-lg">
            <SideBarCard />
          </div>
          <div className="col-span-1 lg:col-span-9 rounded-lg">
            <div className="flex justify-center flex-1">
              <Card className="w-[620px]">
                <CardHeader>
                  <CardTitle className="flex flex-col capitalize items-center justify-center">
                    <Image
                      width={120}
                      height={120}
                      alt={`${user.username} profile pic`}
                      src={user.img || ""}
                    />
                    <h2 className="text-2xl font-bold dark:text-neutral-100 mt-5">
                      {user.fullname}
                    </h2>
                    <h3 className="text-xl dark:text-neutral-500 mt-2">
                      @ {user.username}
                    </h3>
                    <h4 className="text-lg dark:text-neutral-300 mt-2">
                      {user.bio || "Your Bio"}
                    </h4>
                  </CardTitle>
                  <CardDescription className="">
                    <div className="grid grid-cols-3 gap-x-4 mt-4">
                      <div className="flex flex-col items-center text-lg gap-2">
                        <span className="dark:text-neutral-100">
                          {user.following.length}
                        </span>
                        <span>Following</span>
                      </div>
                      <div className="flex flex-col items-center text-lg gap-2">
                        <span className="dark:text-neutral-100">
                          {user.followers.length}
                        </span>
                        <span>Followers</span>
                      </div>
                      <div className="flex flex-col items-center text-lg gap-2">
                        <span className="dark:text-neutral-100">
                          {user.posts.length}
                        </span>
                        <span>Posts</span>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1">
                  {currentUser.username === user.username ? (
                    <EditProfileModal user={currentUser}/>
                  ) : (
                    currentUser.following.includes(user._id.toString()) ? (
                    <ProfileFollowUnfollowBtn isFollowing={true} username={username} />
                    ) : (
                      <ProfileFollowUnfollowBtn isFollowing={false} username={username} />
                    )
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2 items-start justify-start">
                  <div className="flex gap-2">
                    <MapPin />
                    {user.location || "Iran"}
                  </div>
                  <div className="flex gap-2">
                    <CalendarCheck />
                    joined us in {formattedDate}
                  </div>
                </CardFooter>
              </Card>
            </div>
            {/* Tabs for liked posts and posts */}
            <Tabs defaultValue="posts" className="mt-8">
              <TabsList className="mb-3 w-full h-10 !flex !items-center justify-center gap-10 border-b-2 border-neutral-700">
                <TabsTrigger value="posts">
                  <div className="flex items-center gap-1">
                    <span>posts</span>
                    <ImageI size={18} />
                  </div>
                </TabsTrigger>
                <TabsTrigger value="likedPosts">
                  <div className="flex items-center gap-1">
                    <span>liked posts</span>
                    <Heart size={18} />
                  </div>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                <ScrollArea className="h-[500px]">
                  {userPosts.length > 0 ? (
                    userPosts.map((post, index) => (
                      <Post
                        key={index + 1}
                        post={JSON.parse(JSON.stringify(post))}
                        currentUser={JSON.parse(JSON.stringify(user))}
                      />
                    ))
                  ) : (
                    <p className="bg-neutral-900 p-4 rounded-md shadow-md dark:text-neutral-200">
                      no posts yet
                    </p>
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="likedPosts">
                <ScrollArea className="h-[500px]">
                  {userLikedPosts.length > 0 ? (
                    userLikedPosts.map((post, index) => (
                      <Post
                        key={index + 1}
                        post={JSON.parse(JSON.stringify(post))}
                        currentUser={JSON.parse(JSON.stringify(user))}
                      />
                    ))
                  ) : (
                    <p className="bg-neutral-900 p-4 rounded-md shadow-md dark:text-neutral-200">
                      no posts liked yet
                    </p>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
            {/* End of Tabs */}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const username = (await params).username;

  // fetch data
  const user: IUser = (await usersModel.findOne({ username })) as IUser;

  return {
    title: `${user.username} Profile Page`,
  };
}

export default page;