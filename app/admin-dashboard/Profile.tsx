import React, { useEffect, useState } from "react";

interface UserProfile {
  name: string;
  email: string;
  contactInfo: string;
  photo: string;
}

interface ProfileProps {
  user: UserProfile | null;
  onUserUpdated: (updatedUser: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUserUpdated }) => {
  const initialState: UserProfile = {
    name: "",
    email: "",
    contactInfo: "",
    photo: "",
  };

  const [formData, setFormData] = useState<UserProfile>(initialState);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit modes

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        contactInfo: user.contactInfo || "",
        photo: user.photo || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUserUpdated(formData);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
    setIsEditing(false); // Switch back to view mode after submission
  };

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-br from-purple-400 to-blue-500 shadow-lg rounded-lg p-6 mt-4 transition-transform transform hover:scale-105">
      {alertVisible && (
        <div className="bg-green-500 text-white p-3 rounded-lg text-center mb-4 transition-opacity duration-300 ease-in-out opacity-100">
          Profile updated successfully! 🎉
        </div>
      )}
      <h2 className="text-2xl font-bold text-center text-white mb-4">
        {isEditing ? "Edit Profile" : "View Profile"}
      </h2>

      {formData.photo && (
        <div className="flex justify-center mb-4">
          <img
            src={formData.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-white shadow-md"
          />
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300">Name:</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white transition duration-200"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300">Email:</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white transition duration-200"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300">
              Contact Info:
            </span>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white transition duration-200"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300">
              Choose Photo:
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 p-2 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-300 bg-gray-700 text-white transition duration-200"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-200"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-gray-300 underline mt-2"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="flex flex-col space-y-4">
          <p className="text-gray-300">
            <strong>Name:</strong> {formData.name}
          </p>
          <p className="text-gray-300">
            <strong>Email:</strong> {formData.email}
          </p>
          <p className="text-gray-300">
            <strong>Contact Info:</strong> {formData.contactInfo}
          </p>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-200 mt-4"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
