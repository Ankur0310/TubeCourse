import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; 

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth(); 
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-red-600">Tube</span>
              <span className="text-gray-800">Course</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/generator"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/generator')
                      ? 'text-red-600 bg-red-50' 
                      : 'text-gray-600 hover:text-red-600' 
                  }`}
                >
                  Create Course
                </Link>
                <Link
                  to="/pricing"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/pricing')
                      ? 'text-red-600 bg-red-50' 
                      : 'text-gray-600 hover:text-red-600' 
                  }`}
                >
                  Pricing
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  className="text-gray-600 hover:text-red-600 transition-colors" 
                >
                  Pricing
                </Link>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-200">
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
