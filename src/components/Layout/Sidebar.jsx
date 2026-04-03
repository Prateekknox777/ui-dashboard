import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

function Sidebar({ isOpen, setIsOpen }) {
  // Navigation auto-closer for mobile views
  const handleNavClick = () => {
    if(window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 transition-all duration-300">FinDash</h1>
        
        <button 
          className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          onClick={() => setIsOpen(false)}
          aria-label="Close Sidebar"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="flex flex-col mt-4 overflow-y-auto">
        <NavLink 
          to="/" 
          onClick={handleNavClick}
          className={({ isActive }) => 
            isActive 
              ? "p-4 bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 font-bold border-l-4 border-blue-600 transition-all duration-300" 
              : "p-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-l-4 border-transparent transition-all duration-300"
          }
        >
          Dashboard Overview
        </NavLink>
        
        <NavLink 
          to="/transactions" 
          onClick={handleNavClick}
          className={({ isActive }) => 
            isActive 
              ? "p-4 bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 font-bold border-l-4 border-blue-600 transition-all duration-300" 
              : "p-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-l-4 border-transparent transition-all duration-300"
          }
        >
          Transactions
        </NavLink>

        <NavLink 
          to="/insights" 
          onClick={handleNavClick}
          className={({ isActive }) => 
            isActive 
              ? "p-4 bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 font-bold border-l-4 border-blue-600 transition-all duration-300" 
              : "p-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-l-4 border-transparent transition-all duration-300"
          }
        >
          Financial Insights
        </NavLink>
      </div>
      <div className="mt-auto p-4 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
        <p className="font-medium text-gray-600 dark:text-gray-300 mb-1">&copy; 2026 Zorvyn FinTech Pvt. Ltd. All rights reserved.</p>
        <p className="italic mt-1">Designed By Prateek Knox</p>
      </div>
    </div>
  );
}

export default Sidebar;
