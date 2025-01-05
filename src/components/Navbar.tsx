"use client";
import React, { useEffect, useState } from "react";
import { Bell, Home, User, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { getCurrentUserAction, signOutAction } from "@/actions/auth.actions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface User {
  fullname: string;
  email: string;
  img: string;
}

const Navbar = () => {
  const [user, setUser] = useState<User>({
    fullname: "",
    email: "",
    img: "",
  });

  const router = useRouter()

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await getCurrentUserAction();
      setUser(user.data);
    };
    getCurrentUser();
  }, []);

  const handleLogOut = async () => {
    const isSure = confirm("are you sure you want to log out ?");
    if (isSure) {
      const res = await signOutAction();
      if (res.success) {
        toast({
          title: "Logged out successfully",
          className: "bg-emerald-600",
        });
        router.replace('/signin')
      } else {
        toast({
          title: "Failed to log out",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="sticky top-0 bg-white dark:bg-neutral-900 p-4 flex items-center justify-between border-b border-b-neutral-900 dark:border-b-neutral-50">
      <div className="text-black dark:text-neutral-200 text-2xl sm:text-3xl font-bold">
        Next-Social
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-10">
        <ModeToggle />
        <Link
          href={""}
          className="flex items-center justify-center gap-2 text-black dark:text-neutral-200"
        >
          <Home size={20} className="-translate-y-px" />
          <span>Home</span>
        </Link>
        {user ? (
          <>
            <Link
              href={""}
              className="flex items-center justify-center gap-2 text-black dark:text-neutral-200"
            >
              <Bell size={20} className="-translate-y-px" />
              <span>Notifications</span>
            </Link>
            <Link
              href={""}
              className="flex items-center justify-center gap-2 text-black dark:text-neutral-200"
            >
              <User size={20} className="-translate-y-px" />
              <span>Profile</span>
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent bg-opacity-0 hover:bg-opacity-0 bg-cover hover:bg-transparent focus:bg-transparent focus:bg-none focus:bg-opacity-0">
                    <Avatar>
                      <AvatarImage
                        src={`${user.img || "https://github.com/shadcn.png"}`}
                        alt="@shadcn"
                      />
                      <AvatarFallback>
                        {user?.fullname?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <Button onClick={handleLogOut}>
                      <span>Sign Out</span>
                      <LogOut />
                    </Button>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Link href={"signup"}>
              <Button>Sign Up</Button>
            </Link>
            <Link href={"signin"}>
              <Button>Sign In</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="flex md:hidden items-center gap-2">
        <NavigationMenu className="flex items-center gap-3">
          <ModeToggle />
          <NavigationMenuList>
            <NavigationMenuItem className="">
              <NavigationMenuTrigger>
                <Menu />
              </NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col gap-3 items-center justify-center p-4">
                {user ? (
                  <>
                    <Link
                      href={""}
                      className="flex items-center justify-center gap-2 text-black dark:text-neutral-200"
                    >
                      <Bell size={20} className="-translate-y-px" />
                      <span>Notifications</span>
                    </Link>
                    <Link
                      href={""}
                      className="flex items-center justify-center gap-2 text-black dark:text-neutral-200"
                    >
                      <Home size={20} className="-translate-y-px" />
                      <span>Home</span>
                    </Link>
                    <Link
                      href={""}
                      className="flex items-center justify-center gap-2 text-black dark:text-neutral-200"
                    >
                      <User size={20} className="-translate-y-px" />
                      <span>Profile</span>
                    </Link>
                    <Avatar>
                      <AvatarImage
                        src={`${user.img || "https://github.com/shadcn.png"}`}
                        alt="@shadcn"
                      />
                      <AvatarFallback>
                        {user?.fullname?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Button onClick={handleLogOut}>
                      <span>Sign Out</span>
                      <LogOut />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Link
                      href={""}
                      className="flex items-center justify-center gap-2 text-black dark:text-neutral-200"
                    >
                      <Home size={20} className="-translate-y-px" />
                      <span>Home</span>
                    </Link>
                    <div className="flex items-center gap-3">
                      <Link href={"signup"}>
                        <Button>Sign Up</Button>
                      </Link>
                      <Link href={"signin"}>
                        <Button>Sign In</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navbar;