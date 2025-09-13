import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const GeographicPerformanceMap = ({ className = "" }) => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedRegion, setSelectedRegion] = useState(null);

  const regionData = [
    {
      id: 'beograd',
      name: 'Beograd',
      revenue: 2450000,
      orders: 24500,
      workers: 1250,
      avgOrderValue: 100,
      growth: 12.5,
      coordinates: { lat: 44.7866, lng: 20.4489 },
      cities: [
        { name: 'Novi Beograd', revenue: 850000, orders: 8500, growth: 15.2 },
        { name: 'Stari Grad', revenue: 720000, orders: 7200, growth: 10.8 },
        { name: 'Zemun', revenue: 480000, orders: 4800, growth: 8.5 },
        { name: 'Palilula', revenue: 400000, orders: 4000, growth: 14.1 }
      ]
    },
    {
      id: 'vojvodina',
      name: 'Vojvodina',
      revenue: 1850000,
      orders: 18500,
      workers: 950,
      avgOrderValue: 100,
      growth: 8.7,
      coordinates: { lat: 45.2551, lng: 19.8452 },
      cities: [
        { name: 'Novi Sad', revenue: 650000, orders: 6500, growth: 11.2 },
        { name: 'Subotica', revenue: 520000, orders: 5200, growth: 7.8 },
        { name: 'Zrenjanin', revenue: 380000, orders: 3800, growth: 6.5 },
        { name: 'Pančevo', revenue: 300000, orders: 3000, growth: 9.1 }
      ]
    },
    {
      id: 'sumadija',
      name: 'Šumadija',
      revenue: 3200000,
      orders: 32000,
      workers: 1800,
      avgOrderValue: 100,
      growth: 18.3,
      coordinates: { lat: 44.0165, lng: 20.9064 },
      cities: [
        { name: 'Kragujevac', revenue: 980000, orders: 9800, growth: 16.5 },
        { name: 'Jagodina', revenue: 750000, orders: 7500, growth: 22.1 },
        { name: 'Kraljevo', revenue: 680000, orders: 6800, growth: 14.8 },
        { name: 'Čačak', revenue: 790000, orders: 7900, growth: 19.7 }
      ]
    },
    {
      id: 'juzna-srbija',
      name: 'Južna Srbija',
      revenue: 980000,
      orders: 9800,
      workers: 520,
      avgOrderValue: 100,
      growth: 25.4,
      coordinates: { lat: 43.3247, lng: 21.9033 },
      cities: [
        { name: 'Niš', revenue: 420000, orders: 4200, growth: 28.5 },
        { name: 'Leskovac', revenue: 350000, orders: 3500, growth: 23.2 },
        { name: 'Vranje', revenue: 210000, orders: 2100, growth: 22.8 }
      ]
    }
  ];

  const metricOptions = [
    { value: 'revenue', label: 'Revenue', unit: '$', format: 'currency' },
    { value: 'orders', label: 'Order Volume', unit: '', format: 'number' },
    { value: 'workers', label: 'Active Workers', unit: '', format: 'number' },
    { value: 'growth', label: 'Growth Rate', unit: '%', format: 'percentage' }
  ];

  const timeframeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        })?.format(value);
      case 'number':
        return new Intl.NumberFormat('en-US')?.format(value);
      case 'percentage':
        return `${value}%`;
      default:
        return value;
    }
  };

  const getMetricValue = (region, metric) => {
    return region?.[metric];
  };

  const getIntensityColor = (value, metric) => {
    const maxValue = Math.max(...regionData?.map(r => getMetricValue(r, metric)));
    const intensity = (value / maxValue) * 100;
    
    if (intensity >= 80) return 'bg-primary';
    if (intensity >= 60) return 'bg-primary/80';
    if (intensity >= 40) return 'bg-primary/60';
    if (intensity >= 20) return 'bg-primary/40';
    return 'bg-primary/20';
  };

  const selectedMetricConfig = metricOptions?.find(m => m?.value === selectedMetric);

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <Icon name="Globe" size={24} className="text-primary" />
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">Geographic Performance</h3>
            <p className="text-sm text-muted-foreground">Regional analysis and market insights</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={metricOptions}
            value={selectedMetric}
            onChange={setSelectedMetric}
            className="min-w-[130px]"
          />
          
          <Select
            options={timeframeOptions}
            value={timeframe}
            onChange={setTimeframe}
            className="min-w-[130px]"
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
      {/* Interactive Map Placeholder */}
      <div className="mb-8">
        <div className="bg-accent/20 border border-border rounded-lg p-8 text-center">
          <iframe
            width="100%"
            height="400"
            loading="lazy"
            title="Global Performance Map"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=39.8283,-98.5795&z=2&output=embed"
            className="rounded-lg"
          />
        </div>
      </div>
      {/* Regional Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {regionData?.map((region) => (
          <div 
            key={region?.id} 
            className={`border border-border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedRegion === region?.id ? 'bg-primary/10 border-primary' : 'bg-card hover:bg-accent/20'
            }`}
            onClick={() => setSelectedRegion(selectedRegion === region?.id ? null : region?.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-card-foreground">{region?.name}</h4>
              <div className={`w-4 h-4 rounded-full ${getIntensityColor(getMetricValue(region, selectedMetric), selectedMetric)}`} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-medium text-card-foreground">{formatValue(region?.revenue, 'currency')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Orders:</span>
                <span className="font-medium text-card-foreground">{formatValue(region?.orders, 'number')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Workers:</span>
                <span className="font-medium text-card-foreground">{formatValue(region?.workers, 'number')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Growth:</span>
                <span className={`font-medium ${region?.growth > 15 ? 'text-success' : region?.growth > 10 ? 'text-warning' : 'text-card-foreground'}`}>
                  +{region?.growth}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Detailed City Breakdown */}
      {selectedRegion && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-card-foreground mb-4">
            {regionData?.find(r => r?.id === selectedRegion)?.name} - City Performance
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-muted-foreground font-medium">City</th>
                  <th className="text-right p-3 text-muted-foreground font-medium">Revenue</th>
                  <th className="text-right p-3 text-muted-foreground font-medium">Orders</th>
                  <th className="text-right p-3 text-muted-foreground font-medium">Growth</th>
                  <th className="text-right p-3 text-muted-foreground font-medium">Market Share</th>
                </tr>
              </thead>
              <tbody>
                {regionData?.find(r => r?.id === selectedRegion)?.cities?.map((city, index) => {
                  const regionTotal = regionData?.find(r => r?.id === selectedRegion)?.revenue || 1;
                  const marketShare = ((city?.revenue / regionTotal) * 100)?.toFixed(1);
                  
                  return (
                    <tr key={index} className="border-b border-border/50 hover:bg-accent/20">
                      <td className="p-3 font-medium text-card-foreground">{city?.name}</td>
                      <td className="p-3 text-right text-card-foreground">{formatValue(city?.revenue, 'currency')}</td>
                      <td className="p-3 text-right text-card-foreground">{formatValue(city?.orders, 'number')}</td>
                      <td className="p-3 text-right">
                        <span className={`font-medium ${
                          city?.growth > 15 ? 'text-success' : 
                          city?.growth > 10 ? 'text-warning': 'text-card-foreground'
                        }`}>
                          +{city?.growth}%
                        </span>
                      </td>
                      <td className="p-3 text-right text-card-foreground">{marketShare}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-card-foreground">Fastest Growing</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Latin America leads with 25.4% growth rate
          </p>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-primary" />
            <span className="text-sm font-medium text-card-foreground">Highest Revenue</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Asia Pacific generates $3.2M monthly revenue
          </p>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Users" size={16} className="text-warning" />
            <span className="text-sm font-medium text-card-foreground">Worker Density</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Asia Pacific has highest worker-to-order ratio
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeographicPerformanceMap;