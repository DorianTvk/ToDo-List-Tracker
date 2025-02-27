import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Clock, 
  Calendar, 
  CheckSquare, 
  FileText, 
  BarChart2, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center">
            <Clock className="mr-2" size={24} />
            TimeTracker
          </h1>
        </div>
        
        {/* User info */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center p-2 rounded-md ${
                  isActive('/dashboard')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart2 size={18} className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className={`flex items-center p-2 rounded-md ${
                  isActive('/tasks')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CheckSquare size={18} className="mr-3" />
                Tasks
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className={`flex items-center p-2 rounded-md ${
                  isActive('/calendar')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar size={18} className="mr-3" />
                Calendar
              </Link>
            </li>
            <li>
              <Link
                to="/notes"
                className={`flex items-center p-2 rounded-md ${
                  isActive('/notes')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText size={18} className="mr-3" />
                Notes
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center p-2 rounded-md ${
                  isActive('/settings')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings size={18} className="mr-3" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Logout */}
        <div className="p-4 mt-auto border-t">
          <button
            onClick={logout}
            className="flex items-center p-2 w-full text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;