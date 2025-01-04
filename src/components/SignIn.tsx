import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
      <Card className="w-full max-w-md p-4 rounded-lg shadow-lg bg-white dark:bg-neutral-800">
        <CardHeader className="text-center">
          <h2 className="mb-7 text-3xl text-gray-900 dark:text-white">Next-Social</h2>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Log In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="mb-4">
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md">
              Log In
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