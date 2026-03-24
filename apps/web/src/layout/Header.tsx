import React from "react";
import { Menu } from "lucide-react";
import { UserProfileMenu } from "@/components/organisms";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLocation } from "react-router-dom";
import APP_ROUTES from "@/route-config";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isSidebarOpen }) => {
  const location = useLocation();

  const currentPath = location.pathname.substring(1);
  const currentRoute = APP_ROUTES.find((route) => route.path === currentPath);
  const displayTitle = currentRoute?.title || "";
  return (
    <header className="w-full h-full bg-card text-foreground px-4 md:px-6 flex items-center justify-between ">
      <div className="flex items-center gap-4">
        <button
          data-testid="menu-button"
          onClick={onMenuClick}
          aria-haspopup="menu"
          aria-expanded={isSidebarOpen}
          aria-controls="mobile-sidebar"
          className="p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-md lg:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Dynamic Title Section */}
        <h2 className="text-lg font-semibold text-foreground">{displayTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserProfileMenu />
      </div>
    </header>
  );
};

export default Header;
