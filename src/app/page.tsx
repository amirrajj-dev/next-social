import CreatePost from "@/components/CreatePost";
import Navbar from "@/components/Navbar";
import SideBarCard from "@/components/SideBarCard";
import WhoToFollow from "@/components/WhoToFollow";
import React from "react";

const Page = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl py-8 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="col-span-1 lg:col-span-3 rounded-lg shadow-md">
            <SideBarCard />
          </div>
          <div className="col-span-1 lg:col-span-9 rounded-lg shadow-md">
            <div className="grid gap-3 grid-cols-1 md:grid-cols-12">
              <div className="col-span-12 md:col-span-8">
                <CreatePost />
              </div>
              <div className="col-span-12 md:col-span-4">
                <WhoToFollow/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;