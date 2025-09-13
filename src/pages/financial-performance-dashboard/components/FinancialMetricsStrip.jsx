import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialMetricsStrip = ({ metrics }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value?.toFixed(1)}%`;
  };

  const getVarianceColor = (variance) => {
    if (variance > 0) return 'text-success';
    if (variance < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getVarianceIcon = (variance) => {
    if (variance > 0) return 'TrendingUp';
    if (variance < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="dashboard-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${metric?.iconBg}`}>
              <Icon name={metric?.icon} size={16} className={metric?.iconColor} />
            </div>
            <div className={`flex items-center space-x-1 text-xs ${getVarianceColor(metric?.variance)}`}>
              <Icon name={getVarianceIcon(metric?.variance)} size={12} />
              <span>{formatPercentage(metric?.variance)}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {metric?.label}
            </h3>
            <div className="text-2xl font-bold text-foreground">
              {metric?.type === 'currency' ? formatCurrency(metric?.value) : 
               metric?.type === 'percentage' ? `${metric?.value}%` : 
               metric?.value?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              vs. {metric?.comparison}
            </div>
          </div>

          {/* Sparkline placeholder */}
          <div className="mt-3 h-8 flex items-end space-x-0.5">
            {metric?.sparkline?.map((value, index) => (
              <div
                key={index}
                className={`flex-1 rounded-sm ${metric?.variance >= 0 ? 'bg-success/20' : 'bg-destructive/20'}`}
                style={{ height: `${(value / Math.max(...metric?.sparkline)) * 100}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialMetricsStrip;