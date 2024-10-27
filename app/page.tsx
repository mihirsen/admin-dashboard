// app/page.tsx
"use client";

import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-center px-4 sm:px-6 lg:px-8">
      <div className="bg-black bg-opacity-60 backdrop-blur-lg rounded-lg p-8 shadow-2xl transform transition-transform duration-500 hover:scale-105">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          🎉 Welcome to the Admin Dashboard 🎉
        </h1>
        <p className="text-lg sm:text-xl text-white mb-8">
          Please log in to continue. 🔐
        </p>
        <div className="space-x-4">
          <Link href="/Login">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
              Log In 🔑
            </button>
          </Link>
          <Link href="/Signup">
            <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
              Sign Up ✨
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-10 text-white">
        <p className="text-md">Join us for an amazing experience! 🚀</p>
        <p className="text-md">Your journey starts here! 🌟</p>
      </div>
    </div>
  );
};

export default HomePage;
