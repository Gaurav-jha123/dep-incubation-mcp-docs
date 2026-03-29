import React from "react";
import { Menu } from "lucide-react";
import { UserProfileMenu } from "@/components/organisms";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLocation } from "react-router-dom";
import APP_ROUTES from "@/route-config";
import { Button } from "@/components/atoms";

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
        <Button
          data-testid="menu-button"
          onClick={onMenuClick}
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isSidebarOpen}
          className="lg:hidden"
          aria-controls="mobile-sidebar"
          variant= 'ghost'
          size='sm'
        >
          <Menu size={24} aria-hidden="true" />
        </Button>

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
