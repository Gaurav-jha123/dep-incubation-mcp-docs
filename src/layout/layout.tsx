import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

// Layout component
const Layout: React.FC = () => {
  return (
    <div className="min-h-screen grid grid-cols-[16rem_1fr] grid-rows-[4rem_1fr]">
      {/* Sidebar */}
      <div className="row-span-2">
        <Sidebar />
      </div>
      {/* Header */}
      <div className="col-start-2 row-start-1">
        <Header />
      </div>
      {/* Main Content */}
      <main className="col-start-2 row-start-2 p-4 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
