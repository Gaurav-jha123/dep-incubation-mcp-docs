import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
// import Footer from "./Footer";

// Layout component
const Layout: React.FC = () => {
  return (
    <div className="min-h-screen grid grid-cols-[250px_1fr] grid-rows-[auto_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="row-span-2 bg-white border-r shadow-sm">
        <Sidebar />
      </div>
      {/* Header */}
      <div className="col-start-2 row-start-1 bg-white border-b shadow-sm">
        <Header />
      </div>
      {/* Main Content */}
      <main className="main-wrapper col-start-2 row-start-2 p-6 bg-gray-50 overflow-x-hidden overflow-y-auto min-w-0">
        <Outlet />
      </main>

       {/* Footer */}
      {/* <div className="col-start-2 row-start-3">
        <Footer />
      </div> */}
    </div>
  );
};

export default Layout;
