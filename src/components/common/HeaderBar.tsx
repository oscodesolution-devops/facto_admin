import React, { useState } from "react";
import { BiSolidUserCircle } from "react-icons/bi";

interface HeaderBarProps {
  pageTitle: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ pageTitle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="relative flex justify-between items-center px-4 py-2 my-4 shadow-sm">
      <h1 className="text-lg sm:text-2xl font-semibold text-black">{pageTitle}</h1>

      {/* Profile Section */}
      <div className="relative">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm sm:text-md font-medium text-gray-700">Mr. Admin</span>
          <BiSolidUserCircle size={30} />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded-md border">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderBar;
