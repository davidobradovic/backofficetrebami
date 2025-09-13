import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { AppIcon } from '../../components/AppIcon';
import RevenueChart from '../../components/ui/RevenueChart';
import OrdersChart from '../../components/ui/OrdersChart';
import UserGrowthChart from '../../components/ui/UserGrowthChart';
import PerformanceChart from '../../components/ui/PerformanceChart';

const BusinessIntelligenceAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data for comprehensive analytics
  const revenueData = [
    { month: 'Jan', revenue: 45000, profit: 12000, costs: 33000 },
    { month: 'Feb', revenue: 52000, profit: 15000, costs: 37000 },
    { month: 'Mar', revenue: 48000, profit: 13000, costs: 35000 },
    { month: 'Apr', revenue: 61000, profit: 18000, costs: 43000 },
    { month: 'May', revenue: 55000, profit: 16000, costs: 39000 },
    { month: 'Jun', revenue: 67000, profit: 20000, costs: 47000 },
    { month: 'Jul', revenue: 72000, profit: 22000, costs: 50000 },
    { month: 'Aug', revenue: 68000, profit: 21000, costs: 47000 },
    { month: 'Sep', revenue: 75000, profit: 23000, costs: 52000 },
    { month: 'Oct', revenue: 82000, profit: 25000, costs: 57000 },
    { month: 'Nov', revenue: 78000, profit: 24000, costs: 54000 },
    { month: 'Dec', revenue: 85000, profit: 26000, costs: 59000 }
  ];

  const categoryPerformanceData = [
    { name: 'Plumbing', revenue: 125000, orders: 450, avgRating: 4.8, completionRate: 95 },
    { name: 'Electrical', revenue: 98000, orders: 320, avgRating: 4.7, completionRate: 92 },
    { name: 'Cleaning', revenue: 87000, orders: 280, avgRating: 4.9, completionRate: 98 },
    { name: 'Painting', revenue: 65000, orders: 190, avgRating: 4.6, completionRate: 89 },
    { name: 'Carpentry', revenue: 54000, orders: 150, avgRating: 4.5, completionRate: 87 },
    { name: 'Gardening', revenue: 42000, orders: 120, avgRating: 4.7, completionRate: 93 }
  ];

  const geographicData = [
    { region: 'Belgrade', revenue: 250000, orders: 800, workers: 120, customers: 450 },
    { region: 'Novi Sad', revenue: 180000, orders: 600, workers: 85, customers: 320 },
    { region: 'Niš', revenue: 120000, orders: 400, workers: 60, customers: 250 },
    { region: 'Kragujevac', revenue: 95000, orders: 300, workers: 45, customers: 180 },
    { region: 'Subotica', revenue: 75000, orders: 250, workers: 35, customers: 140 }
  ];

  const customerSegmentationData = [
    { segment: 'High Value', count: 150, revenue: 300000, avgOrderValue: 2000 },
    { segment: 'Regular', count: 800, revenue: 400000, avgOrderValue: 500 },
    { segment: 'New', count: 200, revenue: 100000, avgOrderValue: 500 },
    { segment: 'At Risk', count: 50, revenue: 25000, avgOrderValue: 500 }
  ];

  const workerPerformanceData = [
    { subject: 'Response Time', A: 85, B: 78 },
    { subject: 'Quality', A: 92, B: 88 },
    { subject: 'Punctuality', A: 88, B: 82 },
    { subject: 'Communication', A: 90, B: 85 },
    { subject: 'Problem Solving', A: 87, B: 80 },
    { subject: 'Customer Satisfaction', A: 94, B: 89 }
  ];

  const timeSeriesData = [
    { month: 'Jan', users: 1200, workers: 150, orders: 180, revenue: 45000 },
    { month: 'Feb', users: 1350, workers: 180, orders: 220, revenue: 52000 },
    { month: 'Mar', users: 1480, workers: 210, orders: 200, revenue: 48000 },
    { month: 'Apr', users: 1620, workers: 240, orders: 280, revenue: 61000 },
    { month: 'May', users: 1750, workers: 270, orders: 250, revenue: 55000 },
    { month: 'Jun', users: 1890, workers: 300, orders: 320, revenue: 67000 },
    { month: 'Jul', users: 2050, workers: 330, orders: 350, revenue: 72000 },
    { month: 'Aug', users: 2180, workers: 360, orders: 340, revenue: 68000 },
    { month: 'Sep', users: 2320, workers: 390, orders: 380, revenue: 75000 },
    { month: 'Oct', users: 2480, workers: 420, orders: 410, revenue: 82000 },
    { month: 'Nov', users: 2620, workers: 450, orders: 390, revenue: 78000 },
    { month: 'Dec', users: 2780, workers: 480, orders: 420, revenue: 85000 }
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, selectedRegion]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch comprehensive analytics data
      const response = await dashboardAPI.getAnalytics({
        dateRange,
        region: selectedRegion,
        metrics: ['revenue', 'orders', 'users', 'workers', 'performance']
      });
      console.log('Analytics data:', response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };

  const handleRefresh = async () => {
    await fetchAnalyticsData();
    setLastUpdated(new Date());
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency: 'RSD'
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('sr-RS').format(number);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dobrodošli na TrebaMi Admin</h1>
          <p className="text-gray-600">Sveobuhvatno praćenje performansi i analiza podataka</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRefresh} iconName="RefreshCw">
            Osveži
          </Button>
          {/* <Button variant="outline" iconName="Download">
            Izvezi izveštaj
          </Button> */}
        </div>
      </div>


      {/* Footer */}
      {/* <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-500">
            Zadnje arzuriano: {lastUpdated.toLocaleString()}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Data refresh: Every 15 minutes</span>
            <span>•</span>
            <span>Next update: {new Date(lastUpdated.getTime() + 15 * 60000).toLocaleTimeString()}</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default BusinessIntelligenceAnalytics;