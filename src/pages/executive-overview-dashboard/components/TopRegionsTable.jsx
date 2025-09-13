import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TopRegionsTable = ({ loading = false }) => {
  const [sortBy, setSortBy] = useState('revenue');
  const [sortOrder, setSortOrder] = useState('desc');

  const regionData = [
    {
      id: 1,
      region: 'California',
      country: 'United States',
      revenue: 2450000,
      orders: 15680,
      growth: 18.5,
      satisfaction: 4.8,
      workers: 2340
    },
    {
      id: 2,
      region: 'Beograd',
      country: 'United States', 
      revenue: 2180000,
      orders: 14200,
      growth: 12.3,
      satisfaction: 4.6,
      workers: 1980
    },
    {
      id: 3,
      region: 'London',
      country: 'United Kingdom',
      revenue: 1890000,
      orders: 11500,
      growth: 15.7,
      satisfaction: 4.7,
      workers: 1650
    },
    {
      id: 4,
      region: 'Tokyo',
      country: 'Japan',
      revenue: 1650000,
      orders: 9800,
      growth: 22.1,
      satisfaction: 4.9,
      workers: 1420
    },
    {
      id: 5,
      region: 'Sydney',
      country: 'Australia',
      revenue: 1420000,
      orders: 8900,
      growth: 16.8,
      satisfaction: 4.5,
      workers: 1180
    },
    {
      id: 6,
      region: 'Novi Sad',
              country: 'Srbija',
      revenue: 1280000,
      orders: 7650,
      growth: 14.2,
      satisfaction: 4.6,
      workers: 1050
    }
  ];

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedData = [...regionData]?.sort((a, b) => {
    const aValue = a?.[sortBy];
    const bValue = b?.[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getSortIcon = (column) => {
    if (sortBy !== column) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getGrowthColor = (growth) => {
    if (growth >= 20) return 'text-success';
    if (growth >= 15) return 'text-primary';
    if (growth >= 10) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getSatisfactionColor = (rating) => {
    if (rating >= 4.7) return 'text-success';
    if (rating >= 4.5) return 'text-primary';
    return 'text-warning';
  };

  if (loading) {
    return (
      <div className="dashboard-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6]?.map((i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top Performing Regions</h3>
          <p className="text-sm text-muted-foreground">Regional performance metrics</p>
        </div>
        <Icon name="MapPin" size={20} className="text-muted-foreground" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2">
                <button 
                  onClick={() => handleSort('region')}
                  className="flex items-center space-x-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Region</span>
                  <Icon name={getSortIcon('region')} size={12} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button 
                  onClick={() => handleSort('revenue')}
                  className="flex items-center space-x-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
                >
                  <span>Revenue</span>
                  <Icon name={getSortIcon('revenue')} size={12} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button 
                  onClick={() => handleSort('orders')}
                  className="flex items-center space-x-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
                >
                  <span>Orders</span>
                  <Icon name={getSortIcon('orders')} size={12} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button 
                  onClick={() => handleSort('growth')}
                  className="flex items-center space-x-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
                >
                  <span>Growth</span>
                  <Icon name={getSortIcon('growth')} size={12} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button 
                  onClick={() => handleSort('satisfaction')}
                  className="flex items-center space-x-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
                >
                  <span>Rating</span>
                  <Icon name={getSortIcon('satisfaction')} size={12} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((region, index) => (
              <tr 
                key={region?.id} 
                className="border-b border-border hover:bg-accent/50 transition-colors"
              >
                <td className="py-3 px-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{region?.region}</div>
                      <div className="text-xs text-muted-foreground">{region?.country}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="text-sm font-semibold text-foreground">
                    ${(region?.revenue / 1000000)?.toFixed(1)}M
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="text-sm font-medium text-foreground">
                    {region?.orders?.toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className={`text-sm font-semibold ${getGrowthColor(region?.growth)}`}>
                    +{region?.growth}%
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Icon name="Star" size={12} className={getSatisfactionColor(region?.satisfaction)} />
                    <span className={`text-sm font-medium ${getSatisfactionColor(region?.satisfaction)}`}>
                      {region?.satisfaction}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing top {sortedData?.length} regions</span>
          <span>Updated 5 minutes ago</span>
        </div>
      </div>
    </div>
  );
};

export default TopRegionsTable;