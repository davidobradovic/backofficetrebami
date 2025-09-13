import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const RevenueAnalyticsChart = ({ className = "" }) => {
  const [chartType, setChartType] = useState('line');
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'orders']);
  const [timeGranularity, setTimeGranularity] = useState('daily');

  const revenueData = [
    { date: '2025-08-01', revenue: 125000, orders: 1250, avgOrderValue: 100, profit: 37500 },
    { date: '2025-08-02', revenue: 132000, orders: 1320, avgOrderValue: 100, profit: 39600 },
    { date: '2025-08-03', revenue: 118000, orders: 1180, avgOrderValue: 100, profit: 35400 },
    { date: '2025-08-04', revenue: 145000, orders: 1450, avgOrderValue: 100, profit: 43500 },
    { date: '2025-08-05', revenue: 138000, orders: 1380, avgOrderValue: 100, profit: 41400 },
    { date: '2025-08-06', revenue: 155000, orders: 1550, avgOrderValue: 100, profit: 46500 },
    { date: '2025-08-07', revenue: 162000, orders: 1620, avgOrderValue: 100, profit: 48600 },
    { date: '2025-08-08', revenue: 148000, orders: 1480, avgOrderValue: 100, profit: 44400 },
    { date: '2025-08-09', revenue: 171000, orders: 1710, avgOrderValue: 100, profit: 51300 },
    { date: '2025-08-10', revenue: 165000, orders: 1650, avgOrderValue: 100, profit: 49500 },
    { date: '2025-08-11', revenue: 178000, orders: 1780, avgOrderValue: 100, profit: 53400 },
    { date: '2025-08-12', revenue: 185000, orders: 1850, avgOrderValue: 100, profit: 55500 },
    { date: '2025-08-13', revenue: 192000, orders: 1920, avgOrderValue: 100, profit: 57600 },
    { date: '2025-08-14', revenue: 188000, orders: 1880, avgOrderValue: 100, profit: 56400 },
    { date: '2025-08-15', revenue: 205000, orders: 2050, avgOrderValue: 100, profit: 61500 }
  ];

  const chartTypeOptions = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' }
  ];

  const metricOptions = [
    { value: 'revenue', label: 'Revenue ($)', color: '#2563EB' },
    { value: 'orders', label: 'Order Count', color: '#10B981' },
    { value: 'avgOrderValue', label: 'Avg Order Value ($)', color: '#F59E0B' },
    { value: 'profit', label: 'Profit ($)', color: '#8B5CF6' }
  ];

  const granularityOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US')?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">
            {formatDate(label)}
          </p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-popover-foreground">
                {entry?.dataKey === 'revenue' || entry?.dataKey === 'profit' || entry?.dataKey === 'avgOrderValue'
                  ? formatCurrency(entry?.value)
                  : formatNumber(entry?.value)
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const toggleMetric = (metric) => {
    setSelectedMetrics(prev => 
      prev?.includes(metric)
        ? prev?.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const renderChart = () => {
    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            tickFormatter={(value) => value >= 1000 ? `${value/1000}k` : value}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {selectedMetrics?.map((metric) => {
            const metricConfig = metricOptions?.find(m => m?.value === metric);
            if (!metricConfig) return null;
            
            if (chartType === 'line') {
              return (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={metricConfig?.color}
                  strokeWidth={2}
                  dot={{ fill: metricConfig?.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: metricConfig?.color, strokeWidth: 2 }}
                  name={metricConfig?.label}
                />
              );
            } else {
              return (
                <Bar
                  key={metric}
                  dataKey={metric}
                  fill={metricConfig?.color}
                  name={metricConfig?.label}
                  radius={[2, 2, 0, 0]}
                />
              );
            }
          })}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <Icon name="TrendingUp" size={24} className="text-primary" />
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">Revenue Analytics</h3>
            <p className="text-sm text-muted-foreground">Interactive revenue and order analysis</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={chartTypeOptions}
            value={chartType}
            onChange={setChartType}
            className="min-w-[120px]"
          />
          
          <Select
            options={granularityOptions}
            value={timeGranularity}
            onChange={setTimeGranularity}
            className="min-w-[120px]"
          />
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => {/* Export logic */}}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metricOptions?.map((metric) => (
          <Button
            key={metric?.value}
            variant={selectedMetrics?.includes(metric?.value) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMetric(metric?.value)}
            className="flex items-center space-x-2"
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: metric?.color }}
            />
            <span>{metric?.label}</span>
          </Button>
        ))}
      </div>
      {/* Chart */}
      <div className="w-full">
        {renderChart()}
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-success">+12.5%</p>
          <p className="text-sm text-muted-foreground">Revenue Growth</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">$2.4M</p>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-warning">24.1K</p>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-secondary">$99.58</p>
          <p className="text-sm text-muted-foreground">Avg Order Value</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalyticsChart;