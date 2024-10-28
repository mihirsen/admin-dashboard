"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter(); // Use router

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for strict login credentials
    if (formData.email === "mihir@me.com" && formData.password === "Accept") {
      // If credentials are correct, navigate to the admin dashboard
      router.push("/admin-dashboard");
    } else {
      // If credentials are incorrect, set an error message
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 transition-all duration-300">
        <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>
          <p className="mt-4 text-gray-300">
            Don't have an account?{" "}
            <a href="/Signup" className="text-blue-400 hover:underline">
              Sign Up
            </a>{" "}
            <br />
            <a>
              {" "}
              Use email:mihir@me.com <br /> Password: Accept
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
