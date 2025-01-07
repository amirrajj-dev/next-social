"use client";
import { getCurrentUserAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChangeEvent, useEffect, useState } from "react";
import { Image as ImageIcon, Send, X } from "lucide-react";
import { Input } from "./ui/input";

const CreatePost = () => {
  const [user, setUser] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [previewImg, setPreviewImg] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const user = (await getCurrentUserAction()).data;
      setUser(user);
    };
    getUser();
  }, []);

  const handleChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files[0]) return;
    const imgUrl = URL.createObjectURL(e.target.files[0]);
    setImage(e.target.files[0]);
    setPreviewImg(imgUrl);
  };

  const resetPostImg = ()=>{
    setPreviewImg('');
    setImage('')
  }

  return (
    <div>
      <Card className="divide-y-2 divide-neutral-900 px-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.img} />
              <AvatarFallback>{user?.fullname?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's Up ?"
              className="h-28 resize-none"
            />
          </CardTitle>
        </CardHeader>
        {previewImg && (
          <CardContent className="p-4 flex items-center justify-center">
            <div className="relative">
              <Image
                src={previewImg}
                width={380}
                height={100}
                alt="preview post image"
                className="rounded-md shadow-md"
              />
              <X onClick={resetPostImg} className="text-neutral-100  bg-neutral-900 rounded-md absolute top-4 right-4 animate-bounce cursor-pointer" size={24}  />
            </div>
          </CardContent>
        )}
        <CardFooter className="flex items-center justify-between px-4 py-8">
          <Button
            variant={"ghost"}
            className="flex items-center text-sm text-neutral-500 relative"
          >
            <span>Photo</span>
            <ImageIcon />
            <Input
              onChange={(e) => handleChangeImg(e)}
              type="file"
              className="absolute w-full h-full opacity-0"
            />
          </Button>

          <Button className=" text-sm">
            <span>Post</span>
            <Send />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreatePost;