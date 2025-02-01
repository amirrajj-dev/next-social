# 🧑‍🤝‍🧑 Next-Social

Next-Social is a modern, responsive social networking platform built with the latest version and features of Next.js, Tailwind CSS, MongoDB, and ShadcnUi.

## 📑 Table of Contents

1. [📖 Project Overview](#-project-overview)
2. [⚙️ Features](#️-Features)
3. [🚀 Getting Started](#-getting-started)
4. [🌐 Live Demo](#-live-demo)

## 📖 Project Overview

Next-Social is a full-stack social networking platform that allows users to create posts, comment on them, like them, and follow other users. It also includes real-time notifications and supports dark and light themes.

### ⚙️ Features

⚡User Authentication: Sign-up, Sign-in, Sign-out, and token refresh functionality.

⚡Profile Management: Update profile, view user posts and liked posts.

⚡Post Creation and Management: Create, delete, like/unlike posts.

⚡Comment System: Create, delete, like/unlike comments.

⚡Notification System: Real-time notifications for likes, comments, and follows.

⚡Dark/Light Theme: User-customizable themes with support for system theme detection.

⚡Responsive UI: Fully responsive design using Tailwind CSS and shadcn/ui components.

### 🚀 Getting Started

Before getting started, make sure you have the following tools on your machine:

🔰Node.js

🍏MongoDB

🏡MongoDB Compass (for a better experience)

1. 📋 Clone the repo:

    ```bash
    git clone https://github.com/amirrajj-dev/next-social.git
    ```

2. 📦 Install dependencies:

    ```bash
    npm install
    ```

3. 🛠️ Create a .env file and add your MongoDB URI and secret key:

    ```bash
    MONGODB_URI=mongodb://localhost:27017/next-social
    SECRET_KEY=your_secret_key
    ```

4. ▶️ Run the development server:

    ```bash
    npm run dev
    ```

And that's it! Open [http://localhost:3000](http://localhost:3000) and see the project⚡

## 🌐 Live Demo

Check out the live demo of Next-Social [here](https://next-social-murex.vercel.app/).

## ⚠️ Warning 

Because I'm using the latest version of Next.js, which is 15 right now, you should use the `--force` flag when installing some Shadcn UI components and other dependencies. No UI library is completely in sync with Next.js 15 yet, so there's no problem, and you don't need to worry about it at all. When you enter `npm install` in your terminal, Shadcn automatically suggests the `--force` flag, so we're good🫡✅.

# End🔚

Hope you like this project, my friend🫂❣️😉
