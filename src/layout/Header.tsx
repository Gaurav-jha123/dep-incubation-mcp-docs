import React from "react";
import { Menu } from "lucide-react";
import UserProfileMenu from "@/components/user-profile-menu/user-profile-menu";
import { APP_ROUTES } from "@/App";
import { useLocation } from "react-router";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();

  const currentPath = location.pathname.substring(1);
  const currentRoute = APP_ROUTES.find((route) => route.path === currentPath);
  const displayTitle = currentRoute?.title || "";
  return (
    <header className="w-full h-full bg-white text-gray-900 px-4 md:px-6 flex items-center justify-between border-b">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md lg:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Dynamic Title Section */}
        <h2 className="text-lg font-semibold text-gray-700">{displayTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        <UserProfileMenu />
      </div>
    </header>
  );
};

export default Header;
