// UserToFollow.tsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface UserToFollowProps {
  img: string;
  fullname: string;
  username: string;
  followers: number;
}

const UserToFollow: React.FC<UserToFollowProps> = ({ img, fullname, username, followers }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <Link href={`/profile/${username}`} className="flex items-center">
        <Avatar>
          <AvatarImage src={img} />
          <AvatarFallback>{fullname.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100">{fullname}</div>
          <div className="text-xs text-neutral-500">@{username}</div>
          <div className="text-xs text-neutral-500">{followers} followers</div>
        </div>
      </Link>
      <Button className="ml-3">Follow</Button>
    </div>
  );
};

export default UserToFollow;