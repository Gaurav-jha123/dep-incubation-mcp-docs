import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Settings
} from "lucide-react";

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: "Home", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "SkillMatrix", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Users", path: "/userform", icon: <Users size={18} /> },
    { name: "Projects", path: "/projects", icon: <FolderKanban size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r shadow-lg flex flex-col h-full">

      {/* Logo */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-900">
          🚀 Admin Panel
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">

          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-gray-900 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}

        </ul>
      </nav>



      

      {/* Bottom Profile */}
      <div className="p-4 border-t flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-9 h-9 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">Admin</p>
          <p className="text-xs text-gray-500">admin@email.com</p>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;