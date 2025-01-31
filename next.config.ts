import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //including this url support for Image components
  images: {
    domains: ["secure.gravatar.com", "res.cloudinary.com"],
  },
};

export default nextConfig;