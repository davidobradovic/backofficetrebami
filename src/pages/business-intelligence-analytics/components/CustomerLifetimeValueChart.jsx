import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CustomerLifetimeValueChart = ({ className = "" }) => {
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [timeframe, setTimeframe] = useState('12m');

  const clvData = [
    { segment: 'High Value', customers: 1250, avgCLV: 485.60, acquisitionCost: 65.20, retentionRate: 89.5, color: '#2563EB' },
    { segment: 'Medium Value', customers: 3200, avgCLV: 285.40, acquisitionCost: 45.80, retentionRate: 76.2, color: '#10B981' },
    { segment: 'Low Value', customers: 5800, avgCLV: 125.30, acquisitionCost: 32.50, retentionRate: 58.7, color: '#F59E0B' },
    { segment: 'New Customers', customers: 2100, avgCLV: 95.20, acquisitionCost: 42.30, retentionRate: 45.8, color: '#8B5CF6' },
    { segment: 'At Risk', customers: 890, avgCLV: 165.80, acquisitionCost: 38.90, retentionRate: 32.1, color: '#EF4444' },
    { segment: 'Loyal Premium', customers: 650, avgCLV: 720.50, acquisitionCost: 85.40, retentionRate: 94.2, color: '#F97316' }
  ];

  const cohortData = [
    { month: 'Jan 2024', newCustomers: 1200, month1Retention: 78, month3Retention: 65, month6Retention: 52, month12Retention: 38 },
    { month: 'Feb 2024', newCustomers: 1350, month1Retention: 82, month3Retention: 68, month6Retention: 55, month12Retention: 42 },
    { month: 'Mar 2024', newCustomers: 1180, month1Retention: 75, month3Retention: 62, month6Retention: 48, month12Retention: 35 },
    { month: 'Apr 2024', newCustomers: 1420, month1Retention: 85, month3Retention: 72, month6Retention: 58, month12Retention: 45 },
    { month: 'May 2024', newCustomers: 1580, month1Retention: 88, month3Retention: 75, month6Retention: 62, month12Retention: null },
    { month: 'Jun 2024', newCustomers: 1650, month1Retention: 90, month3Retention: 78, month6Retention: 65, month12Retention: null },
    { month: 'Jul 2024', newCustomers: 1720, month1Retention: 87, month3Retention: 74, month6Retention: null, month12Retention: null },
    { month: 'Aug 2024', newCustomers: 1890, month1Retention: 92, month3Retention: 79, month6Retention: null, month12Retention: null }
  ];

  const segmentOptions = [
    { value: 'all', label: 'All Segments' },
    { value: 'high-value', label: 'High Value' },
    { value: 'medium-value', label: 'Medium Value' },
    { value: 'low-value', label: 'Low Value' },
    { value: 'new-customers', label: 'New Customers' },
    { value: 'at-risk', label: 'At Risk' }
  ];

  const timeframeOptions = [
    { value: '6m', label: 'Last 6 Months' },
    { value: '12m', label: 'Last 12 Months' },
    { value: '24m', label: 'Last 24 Months' }
  ];

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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-lg">
          <h4 className="font-medium text-popover-foreground mb-2">{data?.segment}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customers:</span>
              <span className="font-medium text-popover-foreground">{formatNumber(data?.customers)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg CLV:</span>
              <span className="font-medium text-popover-foreground">{formatCurrency(data?.avgCLV)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CAC:</span>
              <span className="font-medium text-popover-foreground">{formatCurrency(data?.acquisitionCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Retention:</span>
              <span className="font-medium text-popover-foreground">{data?.retentionRate}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const calculateROI = (clv, cac) => {
    return ((clv - cac) / cac * 100)?.toFixed(1);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <Icon name="Users" size={24} className="text-primary" />
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">Customer Lifetime Value</h3>
            <p className="text-sm text-muted-foreground">CLV analysis by customer segments</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={segmentOptions}
            value={segmentFilter}
            onChange={setSegmentFilter}
            className="min-w-[140px]"
          />
          
          <Select
            options={timeframeOptions}
            value={timeframe}
            onChange={setTimeframe}
            className="min-w-[140px]"
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
      {/* CLV vs CAC Scatter Plot */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-card-foreground mb-4">CLV vs Customer Acquisition Cost</h4>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="acquisitionCost" 
                type="number" 
                domain={['dataMin - 10', 'dataMax + 10']}
                name="Customer Acquisition Cost"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis 
                dataKey="avgCLV" 
                type="number" 
                domain={['dataMin - 50', 'dataMax + 50']}
                name="Average CLV"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={clvData} fill="#2563EB">
                {clvData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Segment Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {clvData?.map((segment, index) => (
          <div key={index} className="bg-accent/20 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-card-foreground">{segment?.segment}</h5>
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: segment?.color }}
              />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customers:</span>
                <span className="font-medium text-card-foreground">{formatNumber(segment?.customers)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg CLV:</span>
                <span className="font-medium text-card-foreground">{formatCurrency(segment?.avgCLV)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CAC:</span>
                <span className="font-medium text-card-foreground">{formatCurrency(segment?.acquisitionCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROI:</span>
                <span className={`font-medium ${parseFloat(calculateROI(segment?.avgCLV, segment?.acquisitionCost)) > 200 ? 'text-success' : 'text-warning'}`}>
                  {calculateROI(segment?.avgCLV, segment?.acquisitionCost)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Retention:</span>
                <span className="font-medium text-card-foreground">{segment?.retentionRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Cohort Retention Table */}
      <div>
        <h4 className="text-lg font-medium text-card-foreground mb-4">Cohort Retention Analysis</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Cohort Month</th>
                <th className="text-right p-3 text-muted-foreground font-medium">New Customers</th>
                <th className="text-right p-3 text-muted-foreground font-medium">Month 1</th>
                <th className="text-right p-3 text-muted-foreground font-medium">Month 3</th>
                <th className="text-right p-3 text-muted-foreground font-medium">Month 6</th>
                <th className="text-right p-3 text-muted-foreground font-medium">Month 12</th>
              </tr>
            </thead>
            <tbody>
              {cohortData?.map((cohort, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-accent/20">
                  <td className="p-3 font-medium text-card-foreground">{cohort?.month}</td>
                  <td className="p-3 text-right text-card-foreground">{formatNumber(cohort?.newCustomers)}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      cohort?.month1Retention >= 80 ? 'bg-success/20 text-success' : 
                      cohort?.month1Retention >= 70 ? 'bg-warning/20 text-warning': 'bg-error/20 text-error'
                    }`}>
                      {cohort?.month1Retention}%
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      cohort?.month3Retention >= 70 ? 'bg-success/20 text-success' : 
                      cohort?.month3Retention >= 60 ? 'bg-warning/20 text-warning': 'bg-error/20 text-error'
                    }`}>
                      {cohort?.month3Retention}%
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {cohort?.month6Retention ? (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cohort?.month6Retention >= 60 ? 'bg-success/20 text-success' : 
                        cohort?.month6Retention >= 50 ? 'bg-warning/20 text-warning': 'bg-error/20 text-error'
                      }`}>
                        {cohort?.month6Retention}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {cohort?.month12Retention ? (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cohort?.month12Retention >= 40 ? 'bg-success/20 text-success' : 
                        cohort?.month12Retention >= 30 ? 'bg-warning/20 text-warning': 'bg-error/20 text-error'
                      }`}>
                        {cohort?.month12Retention}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-card-foreground">High Value Opportunity</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Loyal Premium segment shows 8.4x ROI with 94.2% retention rate
          </p>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-card-foreground">Retention Focus</span>
          </div>
          <p className="text-xs text-muted-foreground">
            At-risk segment needs immediate attention with 32.1% retention
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLifetimeValueChart;