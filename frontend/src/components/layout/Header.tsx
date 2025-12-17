import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-neutral-100 sticky top-0 z-30 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-premium flex items-center justify-center">
              <span className="text-white font-serif text-xl">C</span>
            </div>
            <div>
              <h1 className="text-lg font-serif text-neutral-800">
                Cellulite Tracker
              </h1>
              <p className="text-xs text-neutral-500">Premium Wellness</p>
            </div>
          </motion.div>

          {/* User Menu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            {/* User Info */}
            <div className="flex items-center space-x-3 px-4 py-2 rounded-premium bg-secondary">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-neutral-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-neutral-600 hover:text-primary transition-colors rounded-premium hover:bg-secondary"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
