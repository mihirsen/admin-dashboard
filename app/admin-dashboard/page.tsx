"use client";

import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import UserManagement from "./UserManagement";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons for hamburger menu

interface UserProfile {
  name: string;
  email: string;
  contactInfo: string;
  photo: string;
}

const AdminDashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "manage">(
    "profile"
  );
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [bgColor, setBgColor] = useState<string>("bg-gray-900");
  const [menuOpen, setMenuOpen] = useState(false); // State to control the mobile menu

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logout successful!");
    window.location.href = "/Login";
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      const defaultUser: UserProfile = {
        name: "Admin Name",
        email: "admin@example.com",
        contactInfo: "123-456-7890",
        photo: "",
      };
      setCurrentUser(defaultUser);
    }
  }, []);

  const handleUserUpdate = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("userProfile", JSON.stringify(updatedUser));
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      setBgColor("bg-blue-200");
    } else {
      setTheme("dark");
      setBgColor("bg-gray-900");
    }
  };
  const isClient = typeof window !== "undefined";

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col h-screen p-6 ${bgColor} text-white transition-colors duration-300`}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-6">
        {/* Hamburger icon for mobile */}
        <button className="sm:hidden text-white text-2xl" onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop & Mobile Menu */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } sm:flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-2 w-full sm:w-auto`}
        >
          <button
            onClick={() => {
              setActiveSection("profile");
              setMenuOpen(false);
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Admin Profile 👤
          </button>
          <button
            onClick={() => {
              setActiveSection("manage");
              setMenuOpen(false);
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            User Management 👥
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout 🚪
          </button>
          <button
            onClick={toggleTheme}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            Toggle Theme 🌗
          </button>
        </div>
      </nav>

      {/* Content Section */}
      <div className="bg-gray-800 shadow-md rounded-lg p-6 flex-1 overflow-auto">
        {activeSection === "profile" ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">{currentUser?.name}</h3>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-400 hover:underline"
              >
                ✏️ Edit
              </button>
            </div>
            <p className="text-gray-300">{currentUser?.email}</p>
            <p className="text-gray-300">{currentUser?.contactInfo}</p>
            {currentUser?.photo && (
              <img
                src={currentUser.photo}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full mt-4"
              />
            )}
            {isEditing && (
              <Profile user={currentUser} onUserUpdated={handleUserUpdate} />
            )}
          </>
        ) : (
          <UserManagement />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
