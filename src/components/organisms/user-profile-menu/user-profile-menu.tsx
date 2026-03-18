import React, { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store/use-auth-store";
import { useAuthMutation } from "@/services/hooks/mutations/useAuthMutation";

export default function UserProfileMenu() {
  const { logoutMutation } = useAuthMutation();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block z-999" ref={menuRef} data-testid="profile-menu-root">
      <div
        data-testid="profile-trigger"
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="profile-menu-dropdown"
        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <User className="w-5 h-5 text-gray-700" />
      </div>

      {isOpen && (
        <div 
          id="profile-menu-dropdown"
          role="menu"
          data-testid="profile-dropdown" 
          className="absolute right-0 top-12 max-w-xs bg-white rounded-2xl shadow-xl py-4 px-2"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-700" />
            </div>

            <div className="flex flex-col items-start">
              <h3 data-testid="profile-full-name" className="font-semibold text-md text-gray-900">
                {`${user?.name}`}
              </h3>
              <p data-testid="profile-email" className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* <div className="my-4 border-t border-gray-200" /> */}

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg transition text-gray-700">
              <Moon size={18} />
              <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <Switch data-testid="dark-mode-switch" />
          </div> */}

          <div className="my-3 border-t border-gray-200" />

          <div className="space-y-1">
            {/* <MenuItem
              data-testid="menu-item-settings"
              icon={<Settings size={18} />}
              label="Settings"
              onClick={() => setIsOpen(false)}
            /> */}
            <MenuItem
              data-testid="menu-item-logout"
              icon={<LogOut size={18} />}
              label="Log out"
              onClick={() => {
                setIsOpen(false);
                logoutMutation.mutate();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  "data-testid": testId,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  "data-testid"?: string;
}) {
  return (
    <div
      data-testid={testId}
      role="menuitem"
      tabIndex={0}
      className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition text-gray-700 hover:bg-gray-100"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}