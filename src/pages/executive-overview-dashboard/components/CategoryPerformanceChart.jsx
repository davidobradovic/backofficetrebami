import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CategoryPerformanceChart = ({ loading = false }) => {
  const categoryData = [
    { category: 'Food Delivery', revenue: 1250000, orders: 8450, growth: 15.2 },
    { category: 'Transportation', revenue: 980000, orders: 12300, growth: 8.7 },
    { category: 'Home Services', revenue: 750000, orders: 3200, growth: 22.1 },
    { category: 'Healthcare', revenue: 680000, orders: 2100, growth: 18.5 },
    { category: 'Beauty & Wellness', revenue: 520000, orders: 4800, growth: 12.3 },
    { category: 'Pet Care', revenue: 380000, orders: 1900, growth: 28.4 },
    { category: 'Grocery', revenue: 340000, orders: 2800, growth: 6.9 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revenue:</span>
              <span className="font-medium text-popover-foreground">
                ${(data?.revenue / 1000)?.toFixed(0)}k
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Orders:</span>
              <span className="font-medium text-popover-foreground">
                {data?.orders?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Growth:</span>
              <span className="font-medium text-success">
                +{data?.growth}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Order:</span>
              <span className="font-medium text-popover-foreground">
                ${Math.round(data?.revenue / data?.orders)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="dashboard-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-40 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Category Performance</h3>
          <p className="text-sm text-muted-foreground">Revenue by service category</p>
        </div>
        <div className="text-xs text-muted-foreground">
          Last 30 days
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={categoryData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              type="number"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
            />
            <YAxis 
              type="category"
              dataKey="category" 
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="revenue" 
              fill="var(--color-primary)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-muted-foreground">Top Category</div>
            <div className="text-sm font-semibold text-foreground">Food Delivery</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Fastest Growing</div>
            <div className="text-sm font-semibold text-success">Pet Care (+28.4%)</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total Categories</div>
            <div className="text-sm font-semibold text-foreground">{categoryData?.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPerformanceChart;