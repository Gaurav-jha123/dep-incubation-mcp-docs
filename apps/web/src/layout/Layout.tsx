import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
// import { ThemeToggle } from "../components/ui/theme-toggle";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSidebarCollapse = () =>
    setIsSidebarCollapsed((prevCollapsed) => !prevCollapsed);

  return (
    <div className="min-h-screen w-full flex bg-background">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-100 focus:p-4 focus:bg-card focus:text-primary focus:font-bold focus:shadow-md"
      >
        Skip to main content
      </a>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          aria-controls="mobile-sidebar"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsSidebarOpen(false);
            }
          }}
        />
      )}

      {/* Sidebar */}
      <div
        id="mobile-sidebar"
        aria-hidden={!isSidebarOpen}
        className={`
        fixed top-0 left-0 h-screen bg-card border-r shadow-sm z-50 transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? "lg:w-20" : "lg:w-70"}
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
      </div>

      {/* Main area */}
      <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-70"
        }`}
      >
        {/* Header */}
        <div
          className={`fixed top-0 right-0 left-0 h-16 bg-card border-b shadow-sm z-30 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "lg:left-20" : "lg:left-70"
          }`}
        >
          <div className="flex items-center justify-between px-4">
            <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            {/* <ThemeToggle /> */}
          </div>
        </div>

        {/* Main Content */}
        <main id="main-content" className="flex-1 p-4 md:p-6 mt-16 overflow-x-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
