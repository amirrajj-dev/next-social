import { getUsersToFollow } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IUser } from "@/types/types";
import UserToFollow from "./UserToFollow";
import { getCurrentUserAction } from "@/actions/auth.actions";

const WhoToFollow = async () => {
  const usersToFollow: IUser[] = (await getUsersToFollow()).data as IUser[];
  console.log(usersToFollow);
  const currentUser = (await getCurrentUserAction()).data;

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="font-bold dark:text-neutral-100 text-neutral-900 text-lg">
              Please Log In💫
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>You need to be logged in to see who to follow box🐻‍❄️.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="font-bold dark:text-neutral-100 text-neutral-900 text-lg">
            Who To Follow
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {usersToFollow?.length > 0 ? (
          usersToFollow.map((user, index) => (
            <UserToFollow
              key={index + 1}
              followers={+user.followers}
              fullname={user.fullname}
              img={user.img as string}
              username={user.username}
            />
          ))
        ) : (
          <p>No users to follow at the moment.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default WhoToFollow;