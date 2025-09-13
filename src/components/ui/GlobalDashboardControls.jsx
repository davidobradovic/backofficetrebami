import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const GlobalDashboardControls = ({ 
  onDateRangeChange, 
  onRegionChange, 
  onRefresh,
  className = "" 
}) => {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const dateRangeOptions = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
            { value: 'beograd', label: 'Beograd' },
    { value: 'vojvodina', label: 'Vojvodina' },
    { value: 'sumadija', label: 'Šumadija' },
    { value: 'juzna-srbija', label: 'Južna Srbija' }
  ];

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    onDateRangeChange?.(value);
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    onRegionChange?.(value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh?.();
      setLastUpdated(new Date());
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const formatLastUpdated = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date?.toLocaleDateString();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(prev => new Date(prev));
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Date Range Selector */}
      <div className="flex items-center space-x-2">
        <Icon name="Calendar" size={16} className="text-muted-foreground" />
        <Select
          options={dateRangeOptions}
          value={dateRange}
          onChange={handleDateRangeChange}
          className="min-w-[140px]"
        />
      </div>

      {/* Region Filter */}
      <div className="flex items-center space-x-2">
        <Icon name="Globe" size={16} className="text-muted-foreground" />
        <Select
          options={regionOptions}
          value={selectedRegion}
          onChange={handleRegionChange}
          className="min-w-[120px]"
        />
      </div>

      {/* Refresh Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        loading={isRefreshing}
        iconName="RefreshCw"
        iconPosition="left"
        className="flex-shrink-0"
      >
        Refresh
      </Button>

      {/* Last Updated Indicator */}
      <div className="hidden md:flex items-center space-x-2 text-xs text-muted-foreground">
        <Icon name="Clock" size={14} />
        <span>Updated {formatLastUpdated(lastUpdated)}</span>
      </div>

      {/* Export Controls */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          iconName="Download"
          title="Export Data"
          className="flex-shrink-0"
        />
        <Button
          variant="ghost"
          size="sm"
          iconName="Share"
          title="Share Dashboard"
          className="flex-shrink-0"
        />
      </div>
    </div>
  );
};

export default GlobalDashboardControls;