import React from 'react';
import { Frown } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-neutral-900 p-10 rounded-lg shadow-2xl text-center transition-transform duration-500 transform hover:scale-105 space-y-8">
        <Frown className="w-24 h-24 mx-auto text-red-500 animate-pulse" />
        <h1 className="text-4xl font-semibold text-gray-700 dark:text-gray-200">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-100">Oops! The page you are looking for doesn’t exist. It might have been moved or the URL might be incorrect.</p>
        <Link href="/">
            <Button size={'lg'} className="mt-6 transition-all duration-300 transform hover:scale-105">
              Go Back Home
            </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;