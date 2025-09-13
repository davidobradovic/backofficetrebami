import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';

const MonthlyRecurringRevenue = ({ data, growthRate }) => {
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
          <p className="text-sm font-medium text-popover-foreground mb-1">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-success">
              MRR: {formatCurrency(data?.mrr)}
            </p>
            <p className="text-sm text-primary">
              New: {formatCurrency(data?.newMrr)}
            </p>
            <p className="text-sm text-warning">
              Churn: {formatCurrency(data?.churnMrr)}
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

  const currentMrr = data?.[data?.length - 1]?.mrr || 0;
  const previousMrr = data?.[data?.length - 2]?.mrr || 0;
  const mrrGrowth = previousMrr > 0 ? ((currentMrr - previousMrr) / previousMrr) * 100 : 0;

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Monthly Recurring Revenue</h3>
          <p className="text-sm text-muted-foreground">Subscription revenue trends</p>
        </div>
        <div className={`flex items-center space-x-1 text-sm ${mrrGrowth >= 0 ? 'text-success' : 'text-destructive'}`}>
          <Icon name={mrrGrowth >= 0 ? 'TrendingUp' : 'TrendingDown'} size={16} />
          <span>{mrrGrowth >= 0 ? '+' : ''}{mrrGrowth?.toFixed(1)}%</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(currentMrr)}
          </div>
          <div className="text-xs text-muted-foreground">Current MRR</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">
            {formatCurrency(data?.[data?.length - 1]?.newMrr || 0)}
          </div>
          <div className="text-xs text-muted-foreground">New MRR</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-destructive">
            {formatCurrency(data?.[data?.length - 1]?.churnMrr || 0)}
          </div>
          <div className="text-xs text-muted-foreground">Churned MRR</div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="mrr"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#mrrGradient)"
            />
            <Line
              type="monotone"
              dataKey="newMrr"
              stroke="var(--color-success)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="churnMrr"
              stroke="var(--color-destructive)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-muted-foreground">Total MRR</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-muted-foreground">New MRR</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded"></div>
            <span className="text-muted-foreground">Churned MRR</span>
          </div>
        </div>
        <div className="text-muted-foreground">
          Annual Run Rate: {formatCurrency(currentMrr * 12)}
        </div>
      </div>
    </div>
  );
};

export default MonthlyRecurringRevenue;