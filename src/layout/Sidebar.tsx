import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  X,
  DatabaseBackupIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const navIconSize = 20;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <DatabaseBackupIcon size={navIconSize} />,
    },
    {
      name: "SkillMatrix",
      path: "/skillMatrix",
      icon: <LayoutDashboard size={navIconSize} />,
    },

    { name: "Users", path: "/userform", icon: <Users size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
  ];

  return (
    <aside className="w-full h-full bg-white flex flex-col">
      <div
        className={`p-4 border-b flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap overflow-hidden">
            Skill Matrix
          </h1>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCollapse}
            className="hidden lg:inline-flex p-2 text-gray-500 hover:bg-gray-100 rounded-md"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>

          {/* Close Button for Mobile */}
          <button
            data-testid="close-sidebar"
            onClick={onClose}
            className={`p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-md ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={onClose} // Close sidebar on mobile when link is clicked
                title={isCollapsed ? item.name : undefined}
                data-testid={`navlink-${item.path}`}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? "justify-center px-2" : "px-4"} gap-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? "bg-gray-900 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`
                }
                aria-label={item.name}
              >
                <span className="shrink-0">{item.icon}</span>
                {!isCollapsed && item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
