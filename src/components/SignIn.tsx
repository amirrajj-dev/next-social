'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { signInAction, refreshTokenAction } from '@/actions/auth.actions';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignIn = () => {
  const toast = useToast()
  const router = useRouter()
  const [isSigningIn , setIsSigningIn] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSigningIn(true)
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const res = await signInAction(formData);
    
    if (res.success) {
      toast.toast({
        title: "Signed in Successfully",
        description: "Hi again !",
        className: "bg-emerald-600",
      });
      setTimeout(() => {
        router.replace('/')
      }, 5000);
      setIsSigningIn(false)
    } else {
      toast.toast({
        title: 'Error Signing you in',
        description: 'Try again later',
        variant: 'destructive'
      });
      setIsSigningIn(false)
    }
  };

  useEffect(() => {
    const refreshToken = async () => {
      const res = await refreshTokenAction();
      if (res.success) {
        console.log("Token refreshed successfully");
      } else {
        console.log("Failed to refresh token");
      }
    };

    const interval = setInterval(refreshToken, 1000 * 60 * 55); // Refresh token every 55 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900 p-2">
      <Card className="w-full max-w-md p-4 rounded-lg shadow-lg bg-white dark:bg-neutral-800">
        <CardHeader className="text-center">
          <Link href={'/'} className="mb-7 text-3xl text-gray-900 dark:text-white">Next-Social</Link>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <Button disabled={isSigningIn} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
              {isSigningIn ? 'Signing In ...' : ' SignIn'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account? <a href="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">Sign Up</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;