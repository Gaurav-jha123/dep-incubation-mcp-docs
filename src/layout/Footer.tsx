import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white text-gray-900 p-4 flex items-center justify-between shadow-lg border-t">
      
      {/* Left */}
      <div className="text-sm">
        © {new Date().getFullYear()} Incubation Dashboard
      </div>

      {/* Right */}
      <div className="text-sm font-medium">
        Version 1.0.0
      </div>

    </footer>
  );
};

export default Footer;