import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PerformanceScorecard = ({ className = "" }) => {
  const [timeframe, setTimeframe] = useState('30d');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');

  const performanceMetrics = [
    {
      id: 'conversion_rate',
      title: 'Conversion Rate',
      value: 3.24,
      unit: '%',
      change: 0.18,
      changeType: 'increase',
      target: 3.5,
      icon: 'Target',
      description: 'Visitors to customers conversion',
      trend: [2.8, 2.9, 3.1, 3.0, 3.2, 3.1, 3.24]
    },
    {
      id: 'customer_acquisition_cost',
      title: 'Customer Acquisition Cost',
      value: 42.50,
      unit: '$',
      change: -2.30,
      changeType: 'decrease',
      target: 40.00,
      icon: 'DollarSign',
      description: 'Cost to acquire new customer',
      trend: [45.2, 44.8, 43.5, 44.1, 42.8, 43.2, 42.50]
    },
    {
      id: 'customer_lifetime_value',
      title: 'Customer Lifetime Value',
      value: 285.60,
      unit: '$',
      change: 12.40,
      changeType: 'increase',
      target: 300.00,
      icon: 'TrendingUp',
      description: 'Average customer value over lifetime',
      trend: [265, 270, 275, 278, 282, 284, 285.60]
    },
    {
      id: 'order_fulfillment_rate',
      title: 'Order Fulfillment Rate',
      value: 96.8,
      unit: '%',
      change: 1.2,
      changeType: 'increase',
      target: 98.0,
      icon: 'CheckCircle',
      description: 'Successfully completed orders',
      trend: [94.5, 95.2, 95.8, 96.1, 96.5, 96.6, 96.8]
    },
    {
      id: 'average_response_time',
      title: 'Avg Response Time',
      value: 4.2,
      unit: 'min',
      change: -0.8,
      changeType: 'decrease',
      target: 3.5,
      icon: 'Clock',
      description: 'Time to worker assignment',
      trend: [5.2, 4.8, 4.6, 4.5, 4.3, 4.1, 4.2]
    },
    {
      id: 'customer_satisfaction',
      title: 'Customer Satisfaction',
      value: 4.7,
      unit: '/5',
      change: 0.1,
      changeType: 'increase',
      target: 4.8,
      icon: 'Star',
      description: 'Average customer rating',
      trend: [4.5, 4.6, 4.6, 4.7, 4.7, 4.6, 4.7]
    },
    {
      id: 'worker_utilization',
      title: 'Worker Utilization',
      value: 78.5,
      unit: '%',
      change: 3.2,
      changeType: 'increase',
      target: 80.0,
      icon: 'Users',
      description: 'Active worker engagement rate',
      trend: [72, 74, 76, 77, 78, 79, 78.5]
    },
    {
      id: 'revenue_per_user',
      title: 'Revenue Per User',
      value: 156.80,
      unit: '$',
      change: 8.90,
      changeType: 'increase',
      target: 165.00,
      icon: 'BarChart3',
      description: 'Average revenue per active user',
      trend: [142, 145, 148, 152, 154, 155, 156.80]
    }
  ];

  const timeframeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const comparisonOptions = [
    { value: 'previous', label: 'Previous Period' },
    { value: 'year_ago', label: 'Year Ago' },
    { value: 'target', label: 'vs Target' }
  ];

  const getChangeIcon = (changeType) => {
    return changeType === 'increase' ? 'TrendingUp' : 'TrendingDown';
  };

  const getChangeColor = (changeType, metricId) => {
    // For metrics where decrease is good (like CAC, response time)
    const decreaseIsGood = ['customer_acquisition_cost', 'average_response_time'];
    
    if (decreaseIsGood?.includes(metricId)) {
      return changeType === 'decrease' ? 'text-success' : 'text-error';
    }
    
    return changeType === 'increase' ? 'text-success' : 'text-error';
  };

  const getProgressPercentage = (value, target, unit) => {
    if (unit === '%' || unit === '/5') {
      return Math.min((value / target) * 100, 100);
    }
    return Math.min((value / target) * 100, 100);
  };

  const renderMiniChart = (trend) => {
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min;
    
    return (
      <div className="flex items-end space-x-1 h-8">
        {trend?.map((value, index) => {
          const height = range === 0 ? 50 : ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className="bg-primary/30 rounded-sm flex-1 min-w-[2px]"
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <Icon name="BarChart3" size={24} className="text-primary" />
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">Performance Scorecard</h3>
            <p className="text-sm text-muted-foreground">Key conversion and operational metrics</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={timeframeOptions}
            value={timeframe}
            onChange={setTimeframe}
            className="min-w-[130px]"
          />
          
          <Select
            options={comparisonOptions}
            value={comparisonPeriod}
            onChange={setComparisonPeriod}
            className="min-w-[140px]"
          />
          
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => {/* Refresh logic */}}
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics?.map((metric) => (
          <div key={metric?.id} className="bg-accent/20 border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
            {/* Metric Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon name={metric?.icon} size={20} className="text-primary" />
                <h4 className="text-sm font-medium text-card-foreground">{metric?.title}</h4>
              </div>
              <div className={`flex items-center space-x-1 ${getChangeColor(metric?.changeType, metric?.id)}`}>
                <Icon name={getChangeIcon(metric?.changeType)} size={14} />
                <span className="text-xs font-medium">
                  {Math.abs(metric?.change)}{metric?.unit === '$' ? '$' : metric?.unit === '%' ? 'pp' : ''}
                </span>
              </div>
            </div>

            {/* Main Value */}
            <div className="mb-3">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-card-foreground">
                  {metric?.unit === '$' ? '$' : ''}{metric?.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {metric?.unit !== '$' ? metric?.unit : ''}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{metric?.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress to target</span>
                <span>{metric?.target}{metric?.unit !== '$' ? metric?.unit : ''}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${Math.min(getProgressPercentage(metric?.value, metric?.target, metric?.unit), 100)}%` }}
                />
              </div>
            </div>

            {/* Mini Chart */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>7-day trend</span>
                <span className={getChangeColor(metric?.changeType, metric?.id)}>
                  {metric?.changeType === 'increase' ? '+' : ''}{metric?.change}{metric?.unit === '$' ? '$' : metric?.unit === '%' ? 'pp' : ''}
                </span>
              </div>
              {renderMiniChart(metric?.trend)}
            </div>
          </div>
        ))}
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="Target" size={20} className="text-success" />
            <span className="text-lg font-semibold text-success">6/8</span>
          </div>
          <p className="text-sm text-muted-foreground">Metrics on track</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <span className="text-lg font-semibold text-primary">75%</span>
          </div>
          <p className="text-sm text-muted-foreground">Overall performance</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <span className="text-lg font-semibold text-warning">2</span>
          </div>
          <p className="text-sm text-muted-foreground">Needs attention</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceScorecard;