"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { signUpAction } from "@/actions/auth.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const Signup = () => {
  const toast = useToast();
  const router = useRouter();
  const [isSigningUp , setIsSigninigUp] = useState(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSigninigUp(true)
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const res = await signUpAction(formData);
    if (res.error || !res.success) {
      console.log(res.error);
      toast.toast({
        title: "Error Signing you up ",
        description: "Try Again Later",
        variant: "destructive",
      });
    } else {
      toast.toast({
        title: "Signed up Successfully",
        description: "Welcome to our community",
        className: "bg-emerald-600",
      });
      setTimeout(() => {
        router.replace("/");
      }, 5000);
    }
    setIsSigninigUp(false)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900 p-2">
      <Card className="w-full max-w-md p-4 rounded-lg shadow-lg bg-white dark:bg-neutral-800">
        <CardHeader className="text-center">
          <h2 className="mb-7 text-3xl text-gray-900 dark:text-white">
            Next-Social
          </h2>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </Label>
              <Input
                id="fullname"
                name="fullname"
                type="text"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <Label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Gender
              </Label>
              <select
                id="gender"
                name="gender"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <Button
            disabled={isSigningUp}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningUp ? 'Signing Up ...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;