import React from 'react';
import Icon from '../../../components/AppIcon';

const UserAcquisitionFunnel = ({ loading = false }) => {
  const funnelData = [
    { 
      stage: 'Website Visitors', 
      count: 125000, 
      percentage: 100, 
      color: 'bg-primary',
      icon: 'Users'
    },
    { 
      stage: 'App Downloads', 
      count: 45000, 
      percentage: 36, 
      color: 'bg-primary',
      icon: 'Download'
    },
    { 
      stage: 'Account Created', 
      count: 28500, 
      percentage: 63.3, 
      color: 'bg-success',
      icon: 'UserPlus'
    },
    { 
      stage: 'First Order', 
      count: 18200, 
      percentage: 63.9, 
      color: 'bg-success',
      icon: 'ShoppingCart'
    },
    { 
      stage: 'Repeat Customer', 
      count: 12800, 
      percentage: 70.3, 
      color: 'bg-success',
      icon: 'Repeat'
    }
  ];

  const getConversionRate = (current, previous) => {
    if (!previous) return 100;
    return ((current / previous) * 100)?.toFixed(1);
  };

  if (loading) {
    return (
      <div className="dashboard-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-36 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5]?.map((i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">User Acquisition Funnel</h3>
          <p className="text-sm text-muted-foreground">Conversion journey analysis</p>
        </div>
        <Icon name="TrendingDown" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {funnelData?.map((stage, index) => {
          const previousStage = index > 0 ? funnelData?.[index - 1] : null;
          const conversionRate = getConversionRate(stage?.count, previousStage?.count);
          
          return (
            <div key={stage?.stage} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${stage?.color} rounded-lg flex items-center justify-center`}>
                    <Icon name={stage?.icon} size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{stage?.stage}</div>
                    <div className="text-xs text-muted-foreground">
                      {stage?.count?.toLocaleString()} users
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">
                    {conversionRate}%
                  </div>
                  {index > 0 && (
                    <div className="text-xs text-muted-foreground">
                      conversion
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${stage?.color} transition-all duration-500`}
                    style={{ width: `${stage?.percentage}%` }}
                  ></div>
                </div>
                <div className="absolute right-2 top-0 h-3 flex items-center">
                  <span className="text-xs font-medium text-white">
                    {stage?.percentage}%
                  </span>
                </div>
              </div>
              {index < funnelData?.length - 1 && (
                <div className="flex justify-center mt-2">
                  <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Overall Conversion</div>
            <div className="text-lg font-bold text-foreground">
              {((funnelData?.[funnelData?.length - 1]?.count / funnelData?.[0]?.count) * 100)?.toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Drop-off Rate</div>
            <div className="text-lg font-bold text-error">
              {(100 - ((funnelData?.[funnelData?.length - 1]?.count / funnelData?.[0]?.count) * 100))?.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAcquisitionFunnel;