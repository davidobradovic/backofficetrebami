import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import Button from '../../../components/ui/Button';

const CategoryProfitabilityAnalysis = ({ data }) => {
  const [sortBy, setSortBy] = useState('profit');
  const [viewMode, setViewMode] = useState('chart');

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
            <p className="text-sm text-success">
              Revenue: {formatCurrency(data?.revenue)}
            </p>
            <p className="text-sm text-destructive">
              Costs: {formatCurrency(data?.costs)}
            </p>
            <p className="text-sm text-primary">
              Profit: {formatCurrency(data?.profit)}
            </p>
            <p className="text-sm text-muted-foreground">
              Margin: {data?.margin?.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const sortedData = [...data]?.sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b?.revenue - a?.revenue;
      case 'margin':
        return b?.margin - a?.margin;
      case 'profit':
      default:
        return b?.profit - a?.profit;
    }
  });

  const totalRevenue = data?.reduce((sum, item) => sum + item?.revenue, 0);
  const totalProfit = data?.reduce((sum, item) => sum + item?.profit, 0);
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
                  <h3 className="text-lg font-semibold text-foreground">Profitabilnost Kategorija</h3>
        <p className="text-sm text-muted-foreground">Analiza prihoda i profita po kategorijama</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'chart' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('chart')}
            iconName="BarChart3"
          />
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            iconName="Table"
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
            {avgMargin?.toFixed(1)}%
          </div>
                      <div className="text-xs text-muted-foreground">Prosečna Marža</div>
        </div>
      </div>
      {/* Sort Controls */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xs text-muted-foreground">Sort by:</span>
        <div className="flex space-x-1">
          {[
                  { value: 'profit', label: 'Profit' },
      { value: 'revenue', label: 'Prihod' },
      { value: 'margin', label: 'Marža' }
          ]?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setSortBy(option?.value)}
              className={`
                px-3 py-1 text-xs rounded-md transition-colors
                ${sortBy === option?.value 
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
      {viewMode === 'chart' ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="category" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="var(--color-primary)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="profit" fill="var(--color-success)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sortedData?.map((item, index) => (
            <div key={item?.category} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item?.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {item?.orders?.toLocaleString()} orders
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">
                  {formatCurrency(item?.profit)}
                </div>
                <div className={`text-xs ${item?.margin >= 20 ? 'text-success' : item?.margin >= 10 ? 'text-warning' : 'text-destructive'}`}>
                  {item?.margin?.toFixed(1)}% margin
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-muted-foreground">Prihod</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-muted-foreground">Profit</span>
            </div>
          </div>
          <span className="text-muted-foreground">
            {data?.length} categories analyzed
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryProfitabilityAnalysis;