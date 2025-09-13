import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RevenueWaterfallChart = ({ data, selectedPeriod }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(Math.abs(value));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-1">{label}</p>
          <p className={`text-sm ${data?.value >= 0 ? 'text-success' : 'text-destructive'}`}>
            {data?.value >= 0 ? '+' : ''}{formatCurrency(data?.value)}
          </p>
          {data?.description && (
            <p className="text-xs text-muted-foreground mt-1">{data?.description}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const getBarColor = (entry) => {
    if (entry?.type === 'starting') return 'var(--color-primary)';
    if (entry?.type === 'ending') return 'var(--color-success)';
    if (entry?.value >= 0) return 'var(--color-success)';
    return 'var(--color-destructive)';
  };

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Waterfall Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Income streams, costs, and net profit breakdown for {selectedPeriod}
          </p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded"></div>
            <span className="text-muted-foreground">Costs</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-bold text-success">
            {formatCurrency(data?.find(d => d?.type === 'starting')?.value || 0)}
          </div>
          <div className="text-xs text-muted-foreground">Starting Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-success">
            {formatCurrency(data?.filter(d => d?.value > 0 && d?.type !== 'starting' && d?.type !== 'ending')?.reduce((sum, d) => sum + d?.value, 0))}
          </div>
          <div className="text-xs text-muted-foreground">Total Additions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-destructive">
            {formatCurrency(data?.filter(d => d?.value < 0)?.reduce((sum, d) => sum + Math.abs(d?.value), 0))}
          </div>
          <div className="text-xs text-muted-foreground">Total Deductions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">
            {formatCurrency(data?.find(d => d?.type === 'ending')?.value || 0)}
          </div>
          <div className="text-xs text-muted-foreground">Net Profit</div>
        </div>
      </div>
    </div>
  );
};

export default RevenueWaterfallChart;