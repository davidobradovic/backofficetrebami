import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegionalFinancialPerformance = ({ data }) => {
  const [viewMode, setViewMode] = useState('bar');
  const [metric, setMetric] = useState('revenue');

  const COLORS = [
    'var(--color-primary)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-accent)',
    'var(--color-secondary)'
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-primary">
              Revenue: {formatCurrency(data?.revenue)}
            </p>
            <p className="text-sm text-success">
              Profit: {formatCurrency(data?.profit)}
            </p>
            <p className="text-sm text-muted-foreground">
              Orders: {data?.orders?.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Growth: {data?.growth >= 0 ? '+' : ''}{data?.growth?.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getRegionIcon = (region) => {
    switch (region?.toLowerCase()) {
              case 'beograd':
        return 'MapPin';
      case 'europe':
        return 'Globe';
      case 'asia pacific':
        return 'Compass';
      case 'latin america':
        return 'Map';
      default:
        return 'MapPin';
    }
  };

  const sortedData = [...data]?.sort((a, b) => b?.[metric] - a?.[metric]);
  const totalRevenue = data?.reduce((sum, item) => sum + item?.revenue, 0);
  const totalProfit = data?.reduce((sum, item) => sum + item?.profit, 0);
  const totalOrders = data?.reduce((sum, item) => sum + item?.orders, 0);

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
                  <h3 className="text-lg font-semibold text-foreground">Regionalne Performanse</h3>
        <p className="text-sm text-muted-foreground">Finansijski pokazatelji po geografskim regionima</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'bar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('bar')}
            iconName="BarChart3"
          />
          <Button
            variant={viewMode === 'pie' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('pie')}
            iconName="PieChart"
          />
        </div>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(totalRevenue)}
          </div>
                      <div className="text-xs text-muted-foreground">Ukupan Prihod</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-success">
            {formatCurrency(totalProfit)}
          </div>
                      <div className="text-xs text-muted-foreground">Ukupan Profit</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-primary">
            {totalOrders?.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Orders</div>
        </div>
      </div>
      {/* Metric Selector */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xs text-muted-foreground">View by:</span>
        <div className="flex space-x-1">
          {[
            { value: 'revenue', label: 'Revenue' },
            { value: 'profit', label: 'Profit' },
            { value: 'orders', label: 'Orders' }
          ]?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setMetric(option?.value)}
              className={`
                px-3 py-1 text-xs rounded-md transition-colors
                ${metric === option?.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }
              `}
            >
              {option?.label}
            </button>
          ))}
        </div>
      </div>
      {viewMode === 'bar' ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="region" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={metric === 'orders' ? (value) => value?.toLocaleString() : formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={metric} 
                fill="var(--color-primary)" 
                radius={[2, 2, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
                dataKey={metric}
                label={({ region, percent }) => `${region}: ${(percent * 100)?.toFixed(0)}%`}
                labelLine={false}
              >
                {sortedData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* Regional Details */}
      <div className="mt-6 space-y-3">
        {sortedData?.map((region, index) => (
          <div key={region?.region} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name={getRegionIcon(region?.region)} size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{region?.region}</p>
                <p className="text-xs text-muted-foreground">
                  {region?.orders?.toLocaleString()} orders
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">
                {formatCurrency(region?.revenue)}
              </div>
              <div className={`text-xs flex items-center space-x-1 ${region?.growth >= 0 ? 'text-success' : 'text-destructive'}`}>
                <Icon name={region?.growth >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
                <span>{region?.growth >= 0 ? '+' : ''}{region?.growth?.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionalFinancialPerformance;