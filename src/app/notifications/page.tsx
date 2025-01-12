import { getCurrentUserAction } from "@/actions/auth.actions";
import { getNotificationsAction } from "@/actions/notification.action";
import Navbar from "@/components/Navbar";
import SideBarCard from "@/components/SideBarCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INotification, IUser } from "@/types/types";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import moment from "moment";

const Notifications = async () => {
  const user: IUser = (await getCurrentUserAction()).data;
  const notifications: INotification[] = (await getNotificationsAction()).data as INotification[];

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl py-8 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="col-span-1 lg:col-span-3 rounded-lg shadow-md">
            <SideBarCard />
          </div>
          <div className="col-span-1 lg:col-span-9 rounded-lg">
            <Card className="divide-y-2 divide-neutral-900">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Notifications</span>
                  <span>{notifications.filter(notif => !notif.read).length} unread</span>
                </CardTitle>
              </CardHeader>
              <div>
                <ScrollArea className="h-[600px]">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <CardContent
                        key={notif._id.toString()}
                        className="p-4 flex items-start gap-6"
                      >
                        <Avatar>
                          <AvatarImage src={notif.sender.img} />
                          <AvatarFallback>
                            {notif.sender.fullname.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col md:flex-row md:items-center gap-1">
                            <span>
                              {notif.type === "like" ? (
                                <Heart
                                  size={16}
                                  className="translate-y-px text-red-500"
                                />
                              ) : notif.type === "comment" ? (
                                <MessageCircle
                                  size={16}
                                  className="translate-y-px text-indigo-500"
                                />
                              ) : (
                                <UserPlus
                                  size={16}
                                  className="translate-y-px text-emerald-500"
                                />
                              )}
                            </span>
                            <span>{notif.message}</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            {notif.post && (
                              <div className="">
                                <div
                                  className={`flex ${
                                    notif.post.image
                                      ? "flex-col flex-1 items-start"
                                      : "items-center"
                                  } gap-4 bg-neutral-300 dark:bg-neutral-900 rounded-md shadow-md p-4`}
                                >
                                  <Avatar>
                                    <AvatarImage src={user.img} />
                                    <AvatarFallback>
                                      {user.fullname.slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {notif.post.image && (
                                    <Image
                                      src={notif.post.image}
                                      width={200}
                                      height={200}
                                      alt="post pic"
                                      className="rounded-md shadow-md"
                                    />
                                  )}
                                  <span>{notif.post.content}</span>
                                </div>
                                {notif.post && notif.comment && (
                                  <div className="flex items-center mt-4 gap-3 bg-neutral-500 dark:bg-neutral-700 p-3 rounded-md shadow-md">
                                    <Avatar>
                                      <AvatarImage src={notif.sender.img} />
                                      <AvatarFallback>
                                        {notif.sender.fullname?.slice(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{notif.comment.content}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {notif.comment && !notif.post && (
                              <div className="flex items-center gap-3 bg-neutral-300 dark:bg-neutral-900 p-3 rounded-md shadow-md">
                                <Avatar>
                                  <AvatarImage src={user.img} />
                                  <AvatarFallback>
                                    {user.fullname?.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-2">
                                  <span>{notif.comment.content}</span>
                                </div>
                              </div>
                            )}
                            <span className="text-sm font-bold dark:text-neutral-200">
                              {moment(notif.createdAt).fromNow()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    ))
                  ) : (
                    <p className="shadow-md p-4">
                      You Don’t Have any Notifications Yet 🐻‍❄️
                    </p>
                  )}
                </ScrollArea>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;