'use client'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoundPen } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { IUser } from "@/types/types";
import { updateProfileAction } from "@/actions/profile.action";
import { toast } from "@/hooks/use-toast";

const EditProfileModal = ({ user }: { user: IUser }) => {


  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const formdata = new FormData(e.currentTarget as HTMLFormElement)
    const res  = await updateProfileAction(formdata , user.username)
    if (res.success){
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated successfully",
        className : 'bg-emerald-600'
      })
      return
    }else{
      toast({
        title: "Error updating profile",
        description: "An error occurred while updating your profile",
        variant : 'destructive'
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center gap-3">
          <UserRoundPen />
          <span>Edit Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="">
              Name
            </Label>
            <Input
              defaultValue={user.fullname}
              id="fullname"
              name="fullname"
              placeholder="your name"
              className="col-span-full"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="">
              Bio
            </Label>
            <Textarea
              defaultValue={user.bio}
              id="bio"
              name="bio"
              placeholder="your bio"
              className="col-span-full h-24"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="">
              Location
            </Label>
            <Input
              defaultValue={user.location}
              id="location"
              name="location"
              placeholder="tell us where you live"
              className="col-span-full"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="">
              profile
            </Label>
            <Input
              type="file"
              id="img"
              name="img"
              placeholder="tell us where you live"
              className="col-span-full"
            />
          </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;