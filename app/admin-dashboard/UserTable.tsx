import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  contactInfo: string;
  photo: string | null;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [newUser, setNewUser] = useState<Omit<UserProfile, "id">>({
    name: "",
    email: "",
    contactInfo: "",
    photo: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const generateDummyUsers = () => {
      const dummyUsers: UserProfile[] = Array.from(
        { length: 20 },
        (_, index) => ({
          id: index + 1,
          name: faker.name.fullName(),
          email: faker.internet.email(),
          contactInfo: faker.phone.number(),
          photo: faker.image.avatar(),
        })
      );

      setUsers(dummyUsers);
    };

    generateDummyUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUser((prevState) => ({
          ...prevState,
          photo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditing && currentUserId !== null) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === currentUserId ? { ...newUser, id: currentUserId } : user
        )
      );
      setIsEditing(false);
      setCurrentUserId(null);
      setShowModal(false);
    } else {
      const newUserData = { ...newUser, id: users.length + 1 };
      setUsers((prevUsers) => [...prevUsers, newUserData]);
    }

    setNewUser({ name: "", email: "", contactInfo: "", photo: null });
  };

  const handleEditUser = (user: UserProfile) => {
    setNewUser({
      name: user.name,
      email: user.email,
      contactInfo: user.contactInfo,
      photo: user.photo,
    });
    setIsEditing(true);
    setCurrentUserId(user.id);
    setShowModal(true);
  };

  const handleDeleteUser = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  const closeModal = () => {
    setShowModal(false);
    setNewUser({ name: "", email: "", contactInfo: "", photo: null }); // Reset on close
  };

  const closeViewModal = () => {
    setViewModal(false);
    setSelectedUser(null); // Reset selected user on close
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contactInfo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleViewUser = (user: UserProfile) => {
    setSelectedUser(user);
    setViewModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>

      <input
        type="text"
        placeholder="Search by name, email, or contact info"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring focus:ring-blue-500 text-black"
        style={{ color: "black" }}
      />

      <form onSubmit={handleAddOrUpdateUser} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
          <input
            type="text"
            name="contactInfo"
            placeholder="Contact Info"
            value={newUser.contactInfo}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          {isEditing ? "Update User" : "Add User"}
        </button>
      </form>

      {/* User Table */}
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
              Photo
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
              Name
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
              Email
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
              Contact Info
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-center">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-12 h-12 rounded-full mx-auto"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 mx-auto"></div>
                )}
              </td>
              <td className="py-2 px-4 border-b text-black">{user.name}</td>
              <td className="py-2 px-4 border-b text-black">{user.email}</td>
              <td className="py-2 px-4 border-b text-black">
                {user.contactInfo}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => handleViewUser(user)}
                  className="text-green-500 hover:text-green-700 mr-2"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditUser(user)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit User" : "Add User"}
            </h3>
            <form onSubmit={handleAddOrUpdateUser}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  required
                  className="text-black border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                  className="text-black border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="contactInfo"
                  placeholder="Contact Info"
                  value={newUser.contactInfo}
                  onChange={handleInputChange}
                  required
                  className=" text-black border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
                />
              </div>
              <div className="mb-4">
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 w-full"
              >
                {isEditing ? "Update User" : "Add User"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="mt-2 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <div className="mb-4">
              <img
                src={selectedUser.photo || ""}
                alt={selectedUser.name}
                className="w-20 h-20 rounded-full mx-auto "
              />
            </div>
            <div className="text-black mb-4">
              <strong>Name:</strong> {selectedUser.name}
            </div>
            <div className="text-black mb-4">
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div className="text-black mb-4">
              <strong>Contact Info:</strong> {selectedUser.contactInfo}
            </div>
            <button
              type="button"
              onClick={closeViewModal}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
