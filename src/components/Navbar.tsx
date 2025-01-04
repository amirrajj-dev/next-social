import Image from "next/image";
import React from "react";
import { Bell, Home, User, Menu } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { getCurrentUserAction } from "@/actions/auth.actions";

const Navbar = async () => {
  const user = (await getCurrentUserAction()).data;
  console.log(user);
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
            <Image
              src={user.img}
              alt={`${user?.fullname} profile`}
              width={40}
              height={40}
              className="rounded-full"
            />
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
                    <Image
                      src={user.img}
                      alt={`${user?.fullname} profile`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
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
