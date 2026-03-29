import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  X,
  DatabaseBackupIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/atoms";

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

    // { name: "Users", path: "/userform", icon: <Users size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
  ];

  return (
    <aside className="w-full h-full bg-card flex flex-col">
      <div
        className={`p-4 border-b flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-foreground whitespace-nowrap overflow-hidden">
            Skill Matrix
          </h1>
        )}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="hidden p-2 text-muted-foreground hover:bg-accent rounded-md shadow-none transition-none hover:translate-y-0 hover:scale-100 hover:shadow-none hover:ring-0 active:translate-y-0 lg:inline-flex"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </Button>

          {/* Close Button for Mobile */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-testid="close-sidebar"
            onClick={onClose}
            aria-label="Close sidebar"
            className={`p-2 text-muted-foreground hover:bg-accent rounded-md shadow-none transition-none hover:translate-y-0 hover:scale-100 hover:shadow-none hover:ring-0 active:translate-y-0 lg:hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            <X size={20} aria-hidden="true" />
          </Button>
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
                  ${isActive ? "bg-white text-gray-900 shadow" : "text-foreground hover:bg-accent"}`
                }
                aria-label={item.name}
              >
                <span className="shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
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
