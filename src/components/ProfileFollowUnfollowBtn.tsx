'use client'
import { UserMinus, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { followUnfollowUserAction } from "@/actions/user.action";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const ProfileFollowUnfollowBtn: React.FC<{ isFollowing: boolean , username : string }> = ({
  isFollowing, username
}) => {

    const [loading , setIsLoading] = useState(false)
    const handleFollowUnfollowUser = async ()=>{
        setIsLoading(true)
        const res = await followUnfollowUserAction(username)
        if (res!.success){
            toast({
                title: `User ${isFollowing ? 'unFollowed' : 'Followed'} succesfully`,
                className : 'bg-emerald-600'
            })
            setIsLoading(false)
        }else{
            toast({
                title: "Error following user",
                variant : 'destructive'
            })
            setIsLoading(false)
        }
    }

  const handleFollowUnfollow = async () => {
    
  };

  if (isFollowing) {
    return (
    <Button
      onClick={handleFollowUnfollowUser}
      className="w-full flex items-center gap-3"
    >
      <UserMinus />
      <span>{loading ? 'unFollowing ...' : 'unFollow'}</span>
    </Button>
    )
  }

  return (
    <Button
      onClick={handleFollowUnfollowUser}
      className="w-full flex items-center gap-3"
    >
      <UserPlus />
      <span>{loading ? 'Following ...' : 'Follow'}</span>
    </Button>
  );
};

export default ProfileFollowUnfollowBtn;
