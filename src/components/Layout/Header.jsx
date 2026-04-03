import React from 'react';
import { useUserSession } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

const Header = ({ isDarkMode, toggleDarkMode, toggleSidebar }) => {
  // Destructure custom role session properties
  const { activeRole, setActiveRole } = useUserSession();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 md:px-6 w-full transition-all duration-300">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu size={24} />
        </button>
        {/* Reserved for future branding */}
      </div>

      <nav className="flex items-center gap-3 md:gap-4">

        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 dark:bg-gray-600 px-2 py-1 md:px-3 md:py-1 text-sm md:text-base rounded transition-all duration-300 hover:scale-105 shadow-sm"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? '☀️ Bright' : '🌙 Lunar'}
        </button>

        <div className="flex items-center gap-1 md:gap-2 text-sm md:text-base">
          <span className="hidden sm:inline text-gray-600 dark:text-gray-300 transition-all duration-300 font-medium tracking-wide">
            Level:
          </span>
          <select
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded p-1 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[110px] md:max-w-none text-xs md:text-sm"
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value)}
          >
            <option value="viewer">Guest</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </nav>
    </header>
  );
};

export default Header;
