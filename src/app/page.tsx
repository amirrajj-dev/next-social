import Navbar from "@/components/Navbar";
import React from "react";

const Page = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl py-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="col-span-1 lg:col-span-3 bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md">
            <p>Content for sidebar</p>
          </div>
          <div className="col-span-1 lg:col-span-9 bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md">
            <p>Main content area</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;