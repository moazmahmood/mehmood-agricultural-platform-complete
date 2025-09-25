import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Sprout, 
  Cloud, 
  BarChart3, 
  Package, 
  User, 
  X 
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Farms', href: '/farms', icon: MapPin },
  { name: 'Crops', href: '/crops', icon: Sprout },
  { name: 'Weather', href: '/weather', icon: Cloud },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Profile', href: '/profile', icon: User },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo and close button */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Sprout className="w-8 h-8 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">AgriPlatform</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-green-100 text-green-700 border-r-2 border-green-600' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            © 2023 Mehmood Agricultural Platform
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;