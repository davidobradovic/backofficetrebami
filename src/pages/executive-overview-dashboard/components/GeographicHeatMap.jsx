import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const GeographicHeatMap = ({ loading = false }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const regionData = [
    { 
      id: 'north-america',
      name: 'Beograd', 
      coverage: 95, 
      demand: 'High', 
      orders: 12450,
      revenue: 2340000,
      growth: '+12.5%',
      color: 'bg-success'
    },
    { 
      id: 'europe',
      name: 'Europe', 
      coverage: 78, 
      demand: 'Medium', 
      orders: 8920,
      revenue: 1680000,
      growth: '+8.2%',
      color: 'bg-primary'
    },
    { 
      id: 'asia-pacific',
      name: 'Asia Pacific', 
      coverage: 65, 
      demand: 'High', 
      orders: 15680,
      revenue: 2890000,
      growth: '+18.7%',
      color: 'bg-success'
    },
    { 
      id: 'latin-america',
      name: 'Latin America', 
      coverage: 42, 
      demand: 'Low', 
      orders: 3240,
      revenue: 580000,
      growth: '+5.1%',
      color: 'bg-warning'
    },
    { 
      id: 'middle-east',
      name: 'Middle East', 
      coverage: 38, 
      demand: 'Medium', 
      orders: 4560,
      revenue: 890000,
      growth: '+15.3%',
      color: 'bg-primary'
    }
  ];

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'High': return 'text-success';
      case 'Medium': return 'text-primary';
      case 'Low': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5]?.map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
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
          <h3 className="text-lg font-semibold text-foreground">Geographic Coverage</h3>
          <p className="text-sm text-muted-foreground">Service areas & demand</p>
        </div>
        <Icon name="Globe" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {regionData?.map((region) => (
          <div 
            key={region?.id}
            className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
              selectedRegion === region?.id 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedRegion(selectedRegion === region?.id ? null : region?.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${region?.color}`}></div>
                <span className="font-medium text-foreground">{region?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium ${getDemandColor(region?.demand)}`}>
                  {region?.demand}
                </span>
                <Icon 
                  name={selectedRegion === region?.id ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Coverage</span>
              <span className="text-xs font-medium text-foreground">{region?.coverage}%</span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${region?.color}`}
                style={{ width: `${region?.coverage}%` }}
              ></div>
            </div>

            {selectedRegion === region?.id && (
              <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Orders</div>
                  <div className="text-sm font-semibold text-foreground">
                    {region?.orders?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                  <div className="text-sm font-semibold text-foreground">
                    ${(region?.revenue / 1000000)?.toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Growth</div>
                  <div className="text-sm font-semibold text-success">
                    {region?.growth}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg Order</div>
                  <div className="text-sm font-semibold text-foreground">
                    ${Math.round(region?.revenue / region?.orders)}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total Coverage</span>
          <span className="font-medium text-foreground">
            {Math.round(regionData?.reduce((acc, region) => acc + region?.coverage, 0) / regionData?.length)}% Average
          </span>
        </div>
      </div>
    </div>
  );
};

export default GeographicHeatMap;