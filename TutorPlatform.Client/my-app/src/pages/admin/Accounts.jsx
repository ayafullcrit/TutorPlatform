import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/userService";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const result = await getAllUsers();
      if (result.success) {
        setAccounts(result.data);
      }
    } catch (error) {
      console.error("Failed to load accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (role) => {
    const roles = { 1: "Student", 2: "Tutor", 3: "Admin" };
    return roles[role] || "Unknown";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-5xl font-serif">Account Registry</h2>
        <p className="mt-2 text-stone-600">Manage and audit system access.</p>
      </div>

      <div className="bg-[#efefd7] p-6 rounded flex flex-col lg:flex-row gap-4 justify-between">
        <input
          className="bg-transparent border-b border-stone-300 outline-none px-1 py-2 w-full lg:max-w-md"
          placeholder="Search by name, email, or ID..."
        />
        <div className="flex gap-2 flex-wrap">
          <button className="px-4 py-2 bg-[#e1aa36] text-[#5b4000] rounded">All Roles</button>
          <button className="px-4 py-2 bg-white rounded">Tutor</button>
          <button className="px-4 py-2 bg-white rounded">Student</button>
          <button className="px-4 py-2 bg-white rounded">Admin</button>
        </div>
      </div>

      <div className="bg-white rounded p-8 overflow-x-auto">
        {loading ? (
          <div className="text-center py-10">Loading accounts...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-stone-500 border-b">
                <th className="py-4">ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-[#f8f6ee]">
                  <td className="py-4">#{item.id}</td>
                  <td>{item.fullName}</td>
                  <td>{item.email}</td>
                  <td>{getRoleName(item.role)}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${item.tutor?.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {item.role === 2 ? (item.tutor?.isVerified ? "VERIFIED" : "PENDING") : "ACTIVE"}
                    </span>
                  </td>
                  <td className="text-right">
                    <button className="text-[#7b5800]">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}