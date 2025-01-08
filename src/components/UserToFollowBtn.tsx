'use client'

import { followUnfollowUserAction } from "@/actions/user.action"
import { Button } from "./ui/button"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

const UserToFollowBtn = ({username} : {username : string}) => {
    const [isFollowing , setIsFollowing] = useState(false)
    const handleFollowUnfollowUser = async ()=>{
        setIsFollowing(true)
        const res = await followUnfollowUserAction(username)
        if (res.success){
            toast({
                title: "User followed succesfully",
                className : 'bg-emerald-600'
            })
            setIsFollowing(false)
        }else{
            toast({
                title: "Error following user",
                variant : 'destructive'
            })
            setIsFollowing(false)
        }
    }

  return (
    <Button className="ml-3 disabled:cursor-not-allowed disabled:opacity-70" disabled={isFollowing} onClick={handleFollowUnfollowUser}>
        {isFollowing? 'Following...' : 'Follow'}
    </Button>
  )
}

export default UserToFollowBtn