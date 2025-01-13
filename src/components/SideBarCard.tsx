import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getCurrentUserAction } from "@/actions/auth.actions";
import { Mail, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

const SideBarCard = async () => {
  const user = (await getCurrentUserAction()).data;

  return (
    <>
      {user ? (
        <Card className="capitalize divide-y-2 divide-neutral-900 px-4 sm:px-6 lg:px-8">
          <CardHeader className="z-0">
            <CardTitle className="flex flex-col gap-2 items-center justify-center">
              <Image src={user.img} width={80} height={80} className="rounded-full" alt="user profile" />
              <Link href={`/profile/${user.username}`} className="text-lg sm:text-xl text-center">{user.fullname}</Link>
              <Link href={`/profile/${user.username}`} className="dark:text-neutral-500 text-base sm:text-lg">{user.username}</Link>
              <p className="dark:text-neutral-500 text-sm mt-2">{user.bio || 'Your bio'}</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-4 px-0 w-full">
            <div className="flex flex-col items-center justify-center text-lg">
              {user.following.length}
              <span className="dark:text-neutral-500 text-sm">following</span>
            </div>
            <div className="flex flex-col items-center justify-center text-lg">
              {user.followers.length}
              <span className="dark:text-neutral-500 text-sm">followers</span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-4 px-0 gap-3.5">
            <div className="flex items-center gap-1.5 dark:text-neutral-500 text-sm">
              <MapPin size={20} />
              <p>{user.location || 'Iran'}</p>
            </div>
            <div className="flex items-center gap-1.5 dark:text-neutral-500 text-sm">
              <Mail size={20} />
              <p className="lowercase">{user.email}</p>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="capitalize px-4 sm:px-6 lg:px-8">
          <CardHeader>
            <CardTitle className="font-bold text-lg sm:text-xl to-neutral-200 text-center">
              Welcome back!
            </CardTitle>
            <CardDescription className="pt-6 text-center text-sm sm:leading-6">
              Login to access your profile and communicate with others.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href={'/signin'}><Button className="w-full" variant={"outline"}>Login</Button></Link>
            <Link href={'/signup'}><Button className="w-full">Sign Up</Button></Link>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SideBarCard;