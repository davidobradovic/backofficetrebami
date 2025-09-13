import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  trend = 'up',
  subtitle,
  loading = false 
}) => {
  const getTrendColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
    if (trend === 'down') return changeType === 'positive' ? 'TrendingDown' : 'TrendingUp';
    return 'Minus';
  };

  if (loading) {
    return (
      <div className="dashboard-card p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-8 w-8 bg-muted rounded"></div>
          </div>
          <div className="h-8 bg-muted rounded w-32 mb-2"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-6 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={icon} size={16} className="text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        
        {subtitle && (
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        )}
        
        {change && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={getTrendIcon()} 
              size={14} 
              className={getTrendColor()} 
            />
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {change}
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;