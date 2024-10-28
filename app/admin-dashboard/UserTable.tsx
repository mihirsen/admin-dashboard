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
  const [sortOrder, setSortOrder] = useState("nameAsc");

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
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
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
    } else {
      const newUserData = { ...newUser, id: users.length + 1 };
      setUsers((prevUsers) => [...prevUsers, newUserData]);
    }
    setNewUser({ name: "", email: "", contactInfo: "", photo: null });
    setShowModal(false);
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
    setNewUser({ name: "", email: "", contactInfo: "", photo: null });
    setIsEditing(false);
  };

  const closeViewModal = () => {
    setViewModal(false);
    setSelectedUser(null);
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order);
  };

  const sortedUsers = [...users]
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.contactInfo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "nameAsc") return a.name.localeCompare(b.name);
      if (sortOrder === "nameDesc") return b.name.localeCompare(a.name);
      if (sortOrder === "emailAsc") return a.email.localeCompare(b.email);
      if (sortOrder === "emailDesc") return b.email.localeCompare(a.email);
      return 0;
    });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleViewUser = (user: UserProfile) => {
    setSelectedUser(user);
    setViewModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md md:p-6">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, email, or contact info"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring focus:ring-blue-500 text-black"
      />

      {/* Sorting Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <select
          onChange={(e) => handleSortChange(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500 text-black w-full sm:w-auto"
        >
          <option value="nameAsc">Sort by Name (A-Z)</option>
          <option value="nameDesc">Sort by Name (Z-A)</option>
          <option value="emailAsc">Sort by Email (A-Z)</option>
          <option value="emailDesc">Sort by Email (Z-A)</option>
        </select>
      </div>

      {/* Add User Button */}
      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add User
        </button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
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
              <th className="py-2 px-4 border-b text-center text-sm font-medium text-gray-600">
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
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 text-black py-1 px-3 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-center text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-black py-1 px-3 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit User" : "Add User"}
            </h3>
            <form onSubmit={handleAddOrUpdateUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Info
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={newUser.contactInfo}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="border border-gray-300 rounded-md p-2 w-full text-black"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-black py-1 px-3 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <img
              alt={selectedUser.name}
              className="w-24 h-24 rounded-full mb-4 mx-auto"
            />
            <p className="text-sm font-medium text-gray-700">
              Name: {selectedUser.name}
            </p>
            <p className="text-sm font-medium text-gray-700">
              Email: {selectedUser.email}
            </p>
            <p className="text-sm font-medium text-gray-700">
              Contact Info: {selectedUser.contactInfo}
            </p>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={closeViewModal}
                className="bg-gray-300 text-black py-1 px-3 rounded-md"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleEditUser(selectedUser)}
                className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
