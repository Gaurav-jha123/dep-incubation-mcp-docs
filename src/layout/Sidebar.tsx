import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Users", path: "/users" },
    { name: "Projects", path: "/projects" },
    { name: "Reports", path: "/reports" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-white text-gray-900 h-full flex flex-col border-r shadow-lg">

      {/* Logo / Title */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition 
                  ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

   

    </aside>
  );
};

export default Sidebar;