import UserProfileMenu from "@/components/user-profile-menu/user-profile-menu";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="header-wrapper w-full h-16 bg-white text-gray-900 px-6 py-3 flex items-center justify-between">

      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <h1 className="text-xl font-bold whitespace-nowrap">Dashboard</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 max-w-xs"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 flex-shrink-0">

        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-gray-900">
          🔔
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;