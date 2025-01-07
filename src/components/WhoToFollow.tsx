import { getUsersToFollow } from "@/actions/user.action";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IUser } from "@/types/types";
import UserToFollow from "./UserToFollow";

const WhoToFollow = async () => {
  const usersToFollow : IUser[] = (await getUsersToFollow()).data as IUser[];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="font-bold dark:text-neutral-100 text-neutral-900 text-lg">Who To Follow</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {usersToFollow.map((user, index)=>(
          <UserToFollow key={index + 1} followers={+user.followers} fullname={user.fullname} img={user.img as string} username={user.username} />
        ))}
      </CardContent>
    </Card>
  );
};

export default WhoToFollow;