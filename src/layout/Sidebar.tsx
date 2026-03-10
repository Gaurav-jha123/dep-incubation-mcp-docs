import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  CirclePower,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/lib/hooks/use-auth/use-auth";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "SkillMatrix",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Users", path: "/userform", icon: <Users size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
  ];

  return (
    <aside className="w-full h-full bg-white flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Skill Matrix</h1>
        {/* Close Button for Mobile */}
        <button
          onClick={onClose}
          className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-md"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={onClose} // Close sidebar on mobile when link is clicked
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive ? "bg-gray-900 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
          onClick={logout}
        >
          Logout
          <CirclePower className="w-4 h-4" />
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
