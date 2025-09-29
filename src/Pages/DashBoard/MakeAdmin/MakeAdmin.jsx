import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../hook/UseAxiosSecure";

const MakeAdmin = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState("");

  // --- Fetch users ---
  const { data: users = [], refetch, isFetching } = useQuery({
    queryKey: ["users", searchEmail],
    queryFn: async () => {
      const url = `/users/search${searchEmail ? `?email=${searchEmail}` : ""}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
    keepPreviousData: true,
  });

  // --- Mutation ---
  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) =>
      axiosSecure.patch(`/users/${userId}/role`, { role }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", searchEmail] });
      Swal.fire({
        icon: "success",
        title: "Role Updated",
        text: `User role changed to "${variables.role}"`,
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // --- Handlers ---
  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleChangeRole = (userId, newRole) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the role to "${newRole}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate({ userId, role: newRole });
      }
    });
  };

  const roles = ["user", "seller", "admin"]; // supported roles

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage User Roles</h2>

      {/* Search Users */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* Users Table */}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {isFetching && (
            <tr>
              <td colSpan="4" className="text-center">
                Loading...
              </td>
            </tr>
          )}
          {!isFetching && users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No users found
              </td>
            </tr>
          )}
          {!isFetching &&
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td className="capitalize">{user.role}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>
                  <div className="flex gap-2">
                    {roles.map(
                      (r) =>
                        r !== user.role && (
                          <button
                          
                            key={r}
                            className="btn btn-sm btn-outline bg-blue-600"
                            onClick={() => handleChangeRole(user._id, r)}
                          >
                            Make {r}
                          </button>
                        )
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default MakeAdmin;
