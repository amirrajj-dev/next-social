"use client";
import { getCurrentUserAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChangeEvent, useEffect, useState } from "react";
import { Image as ImageIcon, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createPostAction } from "@/actions/post.actions";
import { IUser } from "@/types/types";
import { toast } from "@/hooks/use-toast";

const CreatePost = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string>("");
  const [isPosting , setIsPosting] = useState<boolean>(false)

  useEffect(() => {
    const getUser = async () => {
      const user = (await getCurrentUserAction()).data;
      setUser(user);
    };
    getUser();
  }, []);

  const handleChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const imgFile = e.target.files[0];
    const imgUrl = URL.createObjectURL(imgFile);
    setImage(imgFile);
    setPreviewImg(imgUrl);
  };

  const resetPostImg = () => {
    setPreviewImg("");
    setImage(null);
  };

  const handleSubmitPost = async () => {
    setIsPosting(true)
    if (!user){
      toast({
        title : 'you must be authenticated to create a new post',
        variant : 'destructive'
      })
      setIsPosting(false)
      return;
    }

    if (!content){
      toast({
        title: 'Please fill all the fields',
        variant : 'destructive'
      })
      setIsPosting(false)
      return;
    }
    
    const formData = new FormData();
    formData.append("content", content);
    formData.append("author", user!.fullname);
    if (image) {
      formData.append("image", image);
    }
    
    const response = await createPostAction(formData);
    if (response.success) {
      setContent("");
      resetPostImg();
      toast({
        title: "Post created successfully",
        description: "Your post has been created successfully",
        className : 'bg-emerald-500'
      })
      setIsPosting(false)
    } else {
      toast({
        title : response.message || "Failed to create post.",
        variant : 'destructive'
      })
    }
  };

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
              <X onClick={resetPostImg} className="text-neutral-100 bg-neutral-900 rounded-md absolute top-4 right-4 animate-bounce cursor-pointer" size={24} />
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

          <Button onClick={handleSubmitPost} disabled={isPosting} className="text-sm">
            <span>{isPosting ? 'Posting ...' : 'Post'}</span>
            <Send />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreatePost;