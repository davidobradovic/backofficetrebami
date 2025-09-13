import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Pregled',
      path: '/executive-overview-dashboard',
      icon: 'BarChart3',
      description: 'Strateški uvid i KPI-ji'
    },
    {
      label: 'Operacije',
      path: '/operations-command-center',
      icon: 'Activity',
      description: 'Praćenje u realnom vremenu'
    },
    {
      label: 'Analitika',
      path: '/business-intelligence-analytics',
      icon: 'TrendingUp',
      description: 'Dubinska analiza'
    },
    {
      label: 'Finansije',
      path: '/financial-performance-dashboard',
      icon: 'DollarSign',
      description: 'Prihodi i profitabilnost'
    },
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
    }
  ];

  const moreMenuItems = [
    { label: 'Podešavanja', icon: 'Settings', path: '/settings' },
    { label: 'Pomoć & Podrška', icon: 'HelpCircle', path: '/help' },
    { label: 'Admin Panel', icon: 'Shield', path: '/admin' }
  ];

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={20} color="var(--color-primary-foreground)" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">TrebaMi Admin</h1>
              <p className="text-xs text-muted-foreground -mt-1">Srbija</p>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 hover:bg-accent hover:text-accent-foreground
                ${isActive(item?.path) 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              title={item?.description}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Data Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-success font-medium">Live Data</span>
          </div>

          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              iconName="MoreHorizontal"
              className="hidden md:flex"
            >
              More
            </Button>
            
            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
                {moreMenuItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => {
                      handleNavigation(item?.path);
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="var(--color-primary-foreground)" />
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-popover-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@trebami.rs</p>
                </div>
                <button className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Icon name="User" size={16} />
                  <span>Profile</span>
                </button>
                <button className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Icon name="Settings" size={16} />
                  <span>Preferences</span>
                </button>
                <div className="border-t border-border mt-1 pt-1">
                  <button className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Menu"
            className="lg:hidden"
            onClick={() => {/* Mobile menu logic */}}
          />
        </div>
      </div>
      {/* Mobile Navigation Overlay */}
      <div className="lg:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-sm z-40 hidden">
        <div className="p-6">
          <nav className="space-y-2">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center space-x-3 w-full p-4 rounded-lg text-left
                  transition-colors duration-200
                  ${isActive(item?.path) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                <Icon name={item?.icon} size={20} />
                <div>
                  <div className="font-medium">{item?.label}</div>
                  <div className="text-xs opacity-70">{item?.description}</div>
                </div>
              </button>
            ))}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-border">
            <div className="space-y-2">
              {moreMenuItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className="flex items-center space-x-3 w-full p-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Click outside handler */}
      {(isProfileOpen || isMoreMenuOpen) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setIsProfileOpen(false);
            setIsMoreMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;