import Navbar from "@/components/Navbar";
import { IUser } from "@/types/types";
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
import { CalendarCheck, MapPin, UserRoundPen } from "lucide-react";

type Props = {
  params: Promise<{ username: string }>;
};

const page = async ({ params }: Props) => {
  const username = (await params).username;
  const user: IUser = await usersModel.findOne({ username }).exec();
  if (!user) notFound();

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
          <div className="col-span-1  lg:col-span-9 rounded-lg">
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
                  <Button className="w-full flex items-center gap-3">
                    <UserRoundPen />
                    <span>Edit Profile</span>
                  </Button>
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
            erewrwe
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