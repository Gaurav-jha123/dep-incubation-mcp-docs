import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen w-[280px] bg-white border-r shadow-sm z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-[280px] min-h-screen min-w-0">
        {/* Header */}
        <div className="fixed top-0 right-0 left-0 lg:left-[280px] h-16 bg-white border-b shadow-sm z-30">
          <Header onMenuClick={toggleSidebar} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 mt-16 overflow-x-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
