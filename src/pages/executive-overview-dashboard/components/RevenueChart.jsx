import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data, loading = false }) => {
  const chartData = [
    { month: 'Jan', revenue: 245000, orders: 1250, avgOrder: 196 },
    { month: 'Feb', revenue: 289000, orders: 1420, avgOrder: 204 },
    { month: 'Mar', revenue: 312000, orders: 1580, avgOrder: 197 },
    { month: 'Apr', revenue: 298000, orders: 1490, avgOrder: 200 },
    { month: 'May', revenue: 356000, orders: 1780, avgOrder: 200 },
    { month: 'Jun', revenue: 389000, orders: 1920, avgOrder: 203 },
    { month: 'Jul', revenue: 412000, orders: 2050, avgOrder: 201 },
    { month: 'Aug', revenue: 445000, orders: 2180, avgOrder: 204 },
    { month: 'Sep', revenue: 478000, orders: 2340, avgOrder: 204 },
    { month: 'Oct', revenue: 502000, orders: 2450, avgOrder: 205 },
    { month: 'Nov', revenue: 534000, orders: 2580, avgOrder: 207 },
    { month: 'Dec', revenue: 567000, orders: 2720, avgOrder: 208 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-popover-foreground">
                {entry?.name === 'Revenue' 
                  ? `$${entry?.value?.toLocaleString()}` 
                  : entry?.value?.toLocaleString()
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="dashboard-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-48 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue & Order Trends</h3>
          <p className="text-sm text-muted-foreground">Monthly performance overview</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Orders</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              yAxisId="left"
              dataKey="revenue" 
              fill="var(--color-primary)" 
              name="Revenue"
              radius={[2, 2, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="orders" 
              stroke="var(--color-success)" 
              strokeWidth={3}
              name="Orders"
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;