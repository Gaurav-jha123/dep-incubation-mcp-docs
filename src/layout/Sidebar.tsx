import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Settings,
  CirclePower,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/lib/hooks/use-auth/use-auth";

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: "Home", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "SkillMatrix", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Users", path: "/userform", icon: <Users size={18} /> },
    { name: "Projects", path: "/projects", icon: <FolderKanban size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  const { logout } = useAuth()

  return (
    <aside className="w-full h-full bg-white flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">🚀 Admin Panel</h1>
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
      <div className="p-4 border-t flex items-center gap-3 ml-4 flex-shrink-0">
        
        <Button
          variant="destructive"
          className="flex items-center gap-2 cursor-pointer"
          onClick={logout}
        >
          Logout
          <CirclePower className="w-4 h-4 text-white" />
        </Button>
        {/* <div className="min-w-10 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition">
          <User className="w-5 h-5 text-gray-700" />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
          <p className="text-xs text-gray-500">{emailId}</p>
        </div> */}
      </div>
    </aside>
  );
};

export default Sidebar;