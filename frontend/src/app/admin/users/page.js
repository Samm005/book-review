"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [currentAdminId, setCurrentAdminId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentAdminId(payload.id);
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message);
      }

      setUsers((prev) =>
        prev.filter((user) => user._id !== id)
      );

      setConfirmDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#120a2a] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[900px] h-[900px] bg-purple-700/40 rounded-full blur-[180px] top-[-250px] left-[-250px]" />

        <div className="absolute w-[800px] h-[800px] bg-fuchsia-500/30 rounded-full blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-10 lg:p-14">
        <button
          onClick={() => router.push("/admin")}
          className="mb-8 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-2xl transition"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">
          Users
        </h1>

        <p className="text-gray-300 mb-10">
          Manage registered users.
        </p>

        {loading ? (
          <p className="text-white">Loading users...</p>
        ) : users.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/10">
            <p className="text-xl text-gray-300">
              No users found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]"
              >
                <h2 className="text-xl font-bold text-purple-300">
                  {user.name}
                </h2>

                <p className="text-gray-300">
                  {user.email}
                </p>

                <p className="mt-2">
                  Role:{" "}
                  <span className="text-cyan-300">
                    {user.role}
                  </span>
                </p>

                <p className="text-gray-400 text-sm mt-1">
                  Joined:{" "}
                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}
                </p>

                <div className="mt-4">
                  {user._id === currentAdminId ? (
                    <button
                      disabled
                      className="bg-gray-500/30 px-4 py-2 rounded-xl text-sm cursor-not-allowed"
                    >
                      Your Account
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setConfirmDelete(user._id)
                      }
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      Delete User
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-[#2a1747] p-6 rounded-3xl border border-white/10 w-[90%] max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Delete User?
            </h2>

            <p className="text-gray-300 mb-6">
              This will permanently delete the user and
              all reviews created by them.
            </p>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() =>
                  setConfirmDelete(null)
                }
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  deleteUser(confirmDelete)
                }
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}