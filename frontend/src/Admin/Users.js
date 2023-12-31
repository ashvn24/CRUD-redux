import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ALLUSERS, UPDATEUSER } from "../Redux/ActionType";

function Users() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const allUsers = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();

  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);
  const [isDeleteUserModelOpen, setDeleteUserModelOpen] = useState(false);

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstname,
          last_name: lastname,
          email,
          phone,
          password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log("success");
        const response = await fetch("http://127.0.0.1:8000/cadmin/users/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();

        dispatch({
          type: ALLUSERS,
          data: data,
        });
        console.log(firstname);
      } else {
        setError(data.error);
      }
      setAddUserModalOpen(false)
      setFirstname('')
      setLastname('')
      setEmail('')
      setPhone('')
      setPassword('')
      

    } catch (error) {
      setError("Error occurred during fetch request:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("asasasasasasasasasasasas", selectedUser);
    console.log(`http://127.0.0.1:8000/cadmin/user-update/${selectedUser.id}/`);
    await fetch(
      `http://127.0.0.1:8000/cadmin/user-update/${selectedUser.id}/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          email: selectedUser.email,
          phone: selectedUser.phone,
        }),
      }
    )
      .then((res) => {
        const payload = {
          id: selectedUser.id,
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          email: selectedUser.email,
          phone: selectedUser.phone,
        };
        dispatch({
          type: UPDATEUSER,
          data: payload,
        });
        console.log("success");
        setEditUserModalOpen(false);
      })
      .catch((error) => {
        // Handle any errors that might occur during the fetch request
        console.error("Error occurred during fetch request:", error);
      });
  };

  const handledeleteSubmit = async (e) => {
    e.preventDefault();
    console.log(deleteUser);
    console.log(deleteUser.id);
    setDeleteUserModelOpen(false);
    console.log(`http://localhost:8000/cadmin/user-delete/${deleteUser.id}/`);

    await fetch(`http://127.0.0.1:8000/cadmin/user-delete/${deleteUser.id}/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      console.log(res);
      console.log("success");
      const response = await fetch("http://127.0.0.1:8000/cadmin/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      dispatch({
        type: "ALLUSERS",
        data: data,
      });
    });
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <button
        onClick={() => setAddUserModalOpen(true)}
        className="bg-blue-500 text-white px-4  py-2 rounded-md hover:bg-blue-600 transition float-right"
      >
        Add User
      </button>

      <div className="bg-white p-4 rounded-md shadow-md mt-14 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allUsers &&
              allUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.first_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditUserModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition ml-2"
                      onClick={() => {
                        setDeleteUser(user);
                        setDeleteUserModelOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Add User</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="flex mb-4">
                <div className="w-1/2 mr-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-600"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="mt-1 p-2 w-full border rounded-md"
                    required
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
                <div className="w-1/2 ml-2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-600"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 p-2 w-full border rounded-md"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex mb-4">
                <div className="w-1/2 mr-2">
                  <button
                    type="cancel"
                    className="w-full bg-slate-400  text-white p-2 rounded-md hover:bg-slate-500 focus:outline-none"
                    onClick={() => setAddUserModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
                <div className="w-1/2 ml-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Add User
                  </button>
                </div>
                <div>
                  {error && (
                    <p className="mb-4 text-sm bg-red-400 py-3 w-full px-2 rounded-md font-semibold text-white">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USer Delete modal */}
      {isDeleteUserModelOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Delete User</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <p>Are you sure you want to delete the user?</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  onClick={() => setDeleteUserModelOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition ml-2"
                  onClick={handledeleteSubmit}
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit user model */}
      {isEditUserModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="flex mb-4">
                <div className="w-1/2 mr-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-600"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="mt-1 p-2 w-full border rounded-md"
                    required
                    value={selectedUser ? selectedUser.first_name : ""}
                    onChange={(e) =>
                      setSelectedUser((prevState) => ({
                        ...prevState,
                        first_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="w-1/2 ml-2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={selectedUser ? selectedUser.last_name : ""}
                    onChange={(e) =>
                      setSelectedUser((prevState) => ({
                        ...prevState,
                        last_name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-600"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={selectedUser ? selectedUser.phone : ""}
                  onChange={(e) =>
                    setSelectedUser((prevState) => ({
                      ...prevState,
                      phone: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={selectedUser ? selectedUser.email : ""}
                  onChange={(e) =>
                    setSelectedUser((prevState) => ({
                      ...prevState,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  onClick={() => setEditUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition ml-2"
                  onClick={handleEditSubmit}
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
