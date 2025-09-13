import React, { useState, useEffect } from 'react';

import GlobalDashboardControls from '../../components/ui/GlobalDashboardControls';
import DataStatusIndicator from '../../components/ui/DataStatusIndicator';
import ExportShareControls from '../../components/ui/ExportShareControls';
import KPICard from './components/KPICard';
import RevenueChart from '../../components/ui/RevenueChart';
import OrdersChart from '../../components/ui/OrdersChart';
import UserGrowthChart from '../../components/ui/UserGrowthChart';
import PerformanceChart from '../../components/ui/PerformanceChart';
import GeographicHeatMap from './components/GeographicHeatMap';
import CategoryPerformanceChart from './components/CategoryPerformanceChart';
import UserAcquisitionFunnel from './components/UserAcquisitionFunnel';
import TopRegionsTable from './components/TopRegionsTable';
import { dashboardAPI } from '../../utils/api';

const ExecutiveOverviewDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch dashboard overview data
      const overviewData = await dashboardAPI.getOverview();
      // You can set the data to state here if needed
      console.log('Dashboard data:', overviewData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const handleRefresh = async () => {
    await fetchDashboardData();
    setLastUpdated(new Date());
  };

  const handleExport = async (options) => {
    console.log('Exporting dashboard:', options);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleShare = (options) => {
    console.log('Sharing dashboard:', options);
  };

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
    { month: 'Jul', revenue: 72000 },
    { month: 'Aug', revenue: 68000 },
    { month: 'Sep', revenue: 75000 },
    { month: 'Oct', revenue: 82000 },
    { month: 'Nov', revenue: 78000 },
    { month: 'Dec', revenue: 85000 }
  ];

  const ordersData = [
    { name: 'Plumbing', value: 450 },
    { name: 'Electrical', value: 320 },
    { name: 'Cleaning', value: 280 },
    { name: 'Painting', value: 190 },
    { name: 'Carpentry', value: 150 },
    { name: 'Gardening', value: 120 }
  ];

  const userGrowthData = [
    { month: 'Jan', users: 1200, workers: 150 },
    { month: 'Feb', users: 1350, workers: 180 },
    { month: 'Mar', users: 1480, workers: 210 },
    { month: 'Apr', users: 1620, workers: 240 },
    { month: 'May', users: 1750, workers: 270 },
    { month: 'Jun', users: 1890, workers: 300 },
    { month: 'Jul', users: 2050, workers: 330 },
    { month: 'Aug', users: 2180, workers: 360 },
    { month: 'Sep', users: 2320, workers: 390 },
    { month: 'Oct', users: 2480, workers: 420 },
    { month: 'Nov', users: 2620, workers: 450 },
    { month: 'Dec', users: 2780, workers: 480 }
  ];

  const performanceData = [
    { subject: 'Response Time', A: 85 },
    { subject: 'Quality', A: 92 },
    { subject: 'Punctuality', A: 88 },
    { subject: 'Communication', A: 90 },
    { subject: 'Problem Solving', A: 87 },
    { subject: 'Customer Satisfaction', A: 94 }
  ];

  const kpiData = [
    {
      title: 'Ukupan Prihod',
      value: '€5.67M',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'DollarSign',
      subtitle: 'Mesečno ponavljajući'
    },
    {
      title: 'Aktivni Korisnici',
      value: '284K',
      change: '+8.2%',
      changeType: 'positive',
      icon: 'Users',
      subtitle: 'Poslednjih 30 dana'
    },
    {
      title: 'Obim Porudžbina',
      value: '45.2K',
      change: '+15.7%',
      changeType: 'positive',
      icon: 'ShoppingCart',
      subtitle: 'Ovaj mesec'
    },
    {
      title: 'Iskorišćenost Radnika',
      value: '87.3%',
      change: '+3.1%',
      changeType: 'positive',
      icon: 'Activity',
      subtitle: 'Prosečna stopa'
    },
    {
      title: 'Zadovoljstvo Kupaca',
      value: '4.8/5',
      change: '+0.2',
      changeType: 'positive',
      icon: 'Star',
      subtitle: 'Prosečna ocena'
    },
    {
      title: 'Profitna Marža',
      value: '23.4%',
      change: '-1.2%',
      changeType: 'negative',
      icon: 'TrendingUp',
      subtitle: 'Neto marža'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      
              <main className="p-8">
        {/* Dashboard Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Pregled Izvršne Direkcije</h1>
                <p className="text-muted-foreground">
                  Sveobuhvatni uvid u poslovne performanse i strateške metrike
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <DataStatusIndicator 
                  connectionStatus="connected"
                  lastUpdate={lastUpdated}
                  dataFreshness="live"
                />
                <ExportShareControls 
                  dashboardContext="executive-overview"
                  onExport={handleExport}
                  onShare={handleShare}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <GlobalDashboardControls
                onDateRangeChange={handleDateRangeChange}
                onRegionChange={handleRegionChange}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
                subtitle={kpi?.subtitle}
                loading={loading}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
            {/* Revenue Chart - 8 columns */}
            <div className="xl:col-span-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <RevenueChart data={revenueData} type="area" height={300} />
              </div>
            </div>
            
            {/* Geographic Heat Map - 4 columns */}
            <div className="xl:col-span-4">
              <GeographicHeatMap loading={loading} />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Orders by Category */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Category</h3>
              <OrdersChart data={ordersData} type="pie" height={300} />
            </div>
            
            {/* User Growth */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
              <UserGrowthChart data={userGrowthData} height={300} />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Performance Radar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <PerformanceChart data={performanceData} height={300} />
            </div>
            
            {/* Category Performance Chart */}
            <div className="lg:col-span-1">
              <CategoryPerformanceChart loading={loading} />
            </div>
          </div>

          {/* Bottom Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Acquisition Funnel */}
            <div className="lg:col-span-1">
              <UserAcquisitionFunnel loading={loading} />
            </div>
            
            {/* Top Regions Table */}
            <div className="lg:col-span-1">
              <TopRegionsTable loading={loading} />
            </div>
          </div>

          {/* Dashboard Footer */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="text-sm text-muted-foreground">
                Dashboard poslednji put ažuriran: {lastUpdated?.toLocaleString()}
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Ažuriranje podataka: Svakih 15 minuta</span>
                <span>•</span>
                <span>Sledeće ažuriranje: {new Date(lastUpdated.getTime() + 15 * 60000)?.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExecutiveOverviewDashboard;