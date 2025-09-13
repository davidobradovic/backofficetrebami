import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const PaymentMethodChart = ({ data }) => {
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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground">{data?.name}</p>
          <p className="text-sm text-success">{formatCurrency(data?.value)}</p>
          <p className="text-xs text-muted-foreground">{data?.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="space-y-2 mt-4">
        {payload?.map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-foreground">{entry?.value}</span>
            </div>
            <span className="text-muted-foreground">
              {data?.find(d => d?.name === entry?.value)?.percentage}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  const totalValue = data?.reduce((sum, item) => sum + item?.value, 0);

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
          <p className="text-sm text-muted-foreground">Distribution by transaction volume</p>
        </div>
        <Icon name="CreditCard" size={20} className="text-muted-foreground" />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend payload={data?.map((item, index) => ({
        value: item?.name,
        color: COLORS?.[index % COLORS?.length]
      }))} />
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-xs text-muted-foreground">Total Transaction Volume</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodChart;