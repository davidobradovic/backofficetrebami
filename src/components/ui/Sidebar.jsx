import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppIcon } from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigationItems = [
    // {
    //   label: 'Pregled',
    //   path: '/executive-overview-dashboard',
    //   icon: 'BarChart3',
    //   description: 'Strateški uvid i KPI-ji'
    // },
    // {
    //   label: 'Operacije',
    //   path: '/operations-command-center',
    //   icon: 'Activity',
    //   description: 'Praćenje u realnom vremenu'
    // },
    // {
    //   label: 'Analitika',
    //   path: '/business-intelligence-analytics',
    //   icon: 'TrendingUp',
    //   description: 'Dubinska analiza'
    // },
    // {
    //   label: 'Finansije',
    //   path: '/financial-performance-dashboard',
    //   icon: 'DollarSign',
    //   description: 'Prihodi i profitabilnost'
    // },
    {
      label: 'Korisnici',
      path: '/users-management',
      icon: 'Users',
      description: 'Upravljanje korisnicima'
    },
    {
      label: 'Radnici',
      path: '/workers-management',
      icon: 'Wrench',
      description: 'Upravljanje radnicima'
    },
    {
      label: 'Transakcije',
      path: '/transactions',
      icon: 'CreditCard',
      description: 'Finansijske transakcije'
    },
    {
      label: 'Poruke',
      path: '/messages',
      icon: 'MessageSquare',
      description: 'Upravljanje porukama'
    },
    {
      label: 'Kategorije',
      path: '/categories',
      icon: 'Folder',
      description: 'Upravljanje kategorijama'
    },
    {
      label: 'Baneri',
      path: '/banners',
      icon: 'Image',
      description: 'Upravljanje banerima'
    }
  ];

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <AppIcon name="BarChart3" size={20} color="var(--color-primary-foreground)" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">TrebaMi</h1>
                <p className="text-xs text-muted-foreground -mt-1">Srbija</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-accent transition-colors"
          >
            <AppIcon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={20} 
              className="text-muted-foreground" 
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 hover:bg-accent hover:text-accent-foreground
                  ${isActive(item.path) 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
                title={isCollapsed ? item.description : undefined}
              >
                <AppIcon name={item.icon} size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-border p-4">
          {/* Data Status Indicator */}
          {!isCollapsed && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-success/10 rounded-lg mb-3">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-success font-medium">Live Podaci</span>
            </div>
          )}

          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`
                w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <AppIcon name="User" size={16} color="var(--color-primary-foreground)" />
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || 'admin@trebami.com'}</p>
                  </div>
                  <AppIcon name="ChevronDown" size={16} className="text-muted-foreground" />
                </>
              )}
            </button>

            {isProfileOpen && (
              <div className={`absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-lg shadow-lg py-1 z-50 ${
                isCollapsed ? 'w-48 left-16' : 'w-full'
              }`}>
                <button className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  <AppIcon name="User" size={16} />
                  <span>Profil</span>
                </button>
                <button className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  <AppIcon name="Settings" size={16} />
                  <span>Podešavanja</span>
                </button>
                <div className="border-t border-border mt-1 pt-1">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <AppIcon name="LogOut" size={16} />
                    <span>Odjavi se</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40" />

      {/* Click outside handler */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
