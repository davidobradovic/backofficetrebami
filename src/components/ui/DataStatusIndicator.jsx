import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const DataStatusIndicator = ({ 
  connectionStatus = 'connected',
  lastUpdate,
  dataFreshness = 'live',
  className = "" 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'Wifi',
          label: 'Connected',
          pulse: true
        };
      case 'reconnecting':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'WifiOff',
          label: 'Reconnecting',
          pulse: true
        };
      case 'disconnected':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          icon: 'WifiOff',
          label: 'Disconnected',
          pulse: false
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          icon: 'Wifi',
          label: 'Unknown',
          pulse: false
        };
    }
  };

  const getFreshnessConfig = () => {
    switch (dataFreshness) {
      case 'live':
        return {
          color: 'text-success',
          label: 'Live Data',
          icon: 'Radio'
        };
      case 'recent':
        return {
          color: 'text-primary',
          label: 'Recent Data',
          icon: 'Clock'
        };
      case 'stale':
        return {
          color: 'text-warning',
          label: 'Stale Data',
          icon: 'AlertTriangle'
        };
      default:
        return {
          color: 'text-muted-foreground',
          label: 'Unknown',
          icon: 'HelpCircle'
        };
    }
  };

  const formatTimestamp = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date?.toLocaleTimeString();
  };

  const statusConfig = getStatusConfig();
  const freshnessConfig = getFreshnessConfig();

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Connection Status */}
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${statusConfig?.bgColor}`}>
        <div className="relative">
          <Icon 
            name={statusConfig?.icon} 
            size={14} 
            className={statusConfig?.color} 
          />
          {statusConfig?.pulse && (
            <div className={`absolute inset-0 rounded-full ${statusConfig?.color?.replace('text-', 'bg-')} opacity-20 animate-ping`} />
          )}
        </div>
        <span className={`text-xs font-medium ${statusConfig?.color}`}>
          {statusConfig?.label}
        </span>
      </div>
      {/* Data Freshness */}
      <div className="flex items-center space-x-2">
        <Icon 
          name={freshnessConfig?.icon} 
          size={14} 
          className={freshnessConfig?.color} 
        />
        <span className={`text-xs font-medium ${freshnessConfig?.color}`}>
          {freshnessConfig?.label}
        </span>
      </div>
      {/* Last Update Time */}
      {lastUpdate && (
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={12} />
          <span>{formatTimestamp(lastUpdate)}</span>
        </div>
      )}
      {/* Current Time */}
      <div className="hidden lg:flex items-center space-x-2 text-xs text-muted-foreground font-mono">
        <span>{currentTime?.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default DataStatusIndicator;