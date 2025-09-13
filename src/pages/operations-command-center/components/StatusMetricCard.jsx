import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusMetricCard = ({ 
  title, 
  value, 
  unit = '', 
  trend, 
  trendValue, 
  status = 'normal',
  icon,
  className = '' 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'border-error bg-error/5';
      case 'warning':
        return 'border-warning bg-warning/5';
      case 'good':
        return 'border-success bg-success/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getStatusColor()} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name={icon} size={20} className="text-primary" />
            </div>
          )}
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {status !== 'normal' && (
          <div className={`w-3 h-3 rounded-full ${
            status === 'critical' ? 'bg-error animate-pulse' :
            status === 'warning'? 'bg-warning animate-pulse' : 'bg-success'
          }`} />
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 mt-2 ${getTrendColor()}`}>
              <Icon name={getTrendIcon()} size={14} />
              <span className="text-sm font-medium">{trendValue}</span>
              <span className="text-xs text-muted-foreground">vs last hour</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusMetricCard;