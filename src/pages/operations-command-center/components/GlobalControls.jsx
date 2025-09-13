import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const GlobalControls = ({ onRefreshChange, onAreaChange, onTimeRangeChange, className = '' }) => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(15);
  const [selectedArea, setSelectedArea] = useState('all');
  const [timeRange, setTimeRange] = useState('realtime');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshIntervals = [
    { value: 5, label: '5 seconds' },
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' }
  ];

  const serviceAreas = [
    { value: 'all', label: 'All Areas' },
    { value: 'downtown', label: 'Downtown District' },
    { value: 'north', label: 'North District' },
    { value: 'south', label: 'South District' },
    { value: 'east', label: 'East District' },
    { value: 'west', label: 'West District' }
  ];

  const timeRanges = [
    { value: 'realtime', label: 'Real-time' },
    { value: '1h', label: 'Last Hour' },
    { value: '4h', label: 'Last 4 Hours' },
    { value: '24h', label: 'Last 24 Hours' }
  ];

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastUpdate(new Date());
        onRefreshChange?.();
      }, refreshInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, onRefreshChange]);

  const handleRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleIntervalChange = (value) => {
    setRefreshInterval(value);
  };

  const handleAreaChange = (value) => {
    setSelectedArea(value);
    onAreaChange?.(value);
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    onTimeRangeChange?.(value);
  };

  const formatLastUpdate = () => {
    return lastUpdate?.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Section - Auto Refresh Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={handleRefreshToggle}
              iconName={autoRefresh ? "Pause" : "Play"}
              iconPosition="left"
            >
              {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
            </Button>
            
            {autoRefresh && (
              <Select
                options={refreshIntervals}
                value={refreshInterval}
                onChange={handleIntervalChange}
                className="w-32"
              />
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Last update: {formatLastUpdate()}</span>
            {autoRefresh && (
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Center Section - Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={16} className="text-muted-foreground" />
            <Select
              options={serviceAreas}
              value={selectedArea}
              onChange={handleAreaChange}
              className="w-40"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <Select
              options={timeRanges}
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="w-36"
            />
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => {
              setLastUpdate(new Date());
              onRefreshChange?.();
            }}
          >
            Refresh Now
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            title="Dashboard Settings"
          />

          <Button
            variant="outline"
            size="sm"
            iconName="Maximize2"
            title="Fullscreen Mode"
            onClick={() => {
              if (document.documentElement?.requestFullscreen) {
                document.documentElement?.requestFullscreen();
              }
            }}
          />
        </div>
      </div>
      {/* Status Indicators */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">System Online</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Wifi" size={14} className="text-success" />
            <span className="text-xs text-muted-foreground">Connected</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">Data Sync: Active</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Monitoring {selectedArea === 'all' ? 'All Areas' : serviceAreas?.find(a => a?.value === selectedArea)?.label} • {timeRange === 'realtime' ? 'Real-time Data' : timeRanges?.find(t => t?.value === timeRange)?.label}
        </div>
      </div>
    </div>
  );
};

export default GlobalControls;