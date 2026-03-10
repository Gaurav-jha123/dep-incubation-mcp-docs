import { useState } from "react";
import skillMatrix from "./../../mocks/skillMatrix";

export default function Reports() {
  const [selectedUser, setSelectedUser] = useState("");

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(e.target.value);
  };

  return (
    <div className="w-full justify-center p-6">
      
      <div className="w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Reports Dashboard
        </h1>

        {/* User Selection */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-semibold text-gray-600">
            Select User
          </label>

          <select
            value={selectedUser}
            onChange={handleUserChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          >
            <option value="">-- Select User --</option>

            {skillMatrix.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Report Section */}
        {selectedUser && (
          <div className="mt-6 p-6 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
            <p className="text-indigo-700 font-medium">
              Generating report for selected user...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}