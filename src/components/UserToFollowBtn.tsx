'use client'

import { followUnfollowUser } from "@/actions/user.action"
import { Button } from "./ui/button"
import { toast } from "@/hooks/use-toast"

const UserToFollowBtn = ({username} : {username : string}) => {

    const handleFollowUnfollowUser = async ()=>{
        const res = await followUnfollowUser(username)
        if (res.success){
            toast({
                title: "User followed succesfully",
                className : 'bg-emerald-600'
            })
        }else{
            toast({
                title: "Error following user",
                variant : 'destructive'
            })
        }
    }

  return (
    <Button className="ml-3" onClick={handleFollowUnfollowUser}>Follow</Button>
  )
}

export default UserToFollowBtn