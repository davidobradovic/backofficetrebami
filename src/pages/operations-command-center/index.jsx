import React, { useState, useCallback } from 'react';

import GlobalControls from './components/GlobalControls';
import StatusMetricCard from './components/StatusMetricCard';
import RealTimeChart from './components/RealTimeChart';
import AlertFeed from './components/AlertFeed';
import ActiveOrdersGrid from './components/ActiveOrdersGrid';

const OperationsCommandCenter = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedArea, setSelectedArea] = useState('all');
  const [timeRange, setTimeRange] = useState('realtime');

  // Mock real-time metrics data
  const [metrics] = useState({
    activeOrders: {
      value: 247,
      trend: 'up',
      trendValue: '+12%',
      status: 'good'
    },
    avgDeliveryTime: {
      value: 28,
      unit: 'min',
      trend: 'down',
      trendValue: '-8%',
      status: 'good'
    },
    workerAvailability: {
      value: 87,
      unit: '%',
      trend: 'down',
      trendValue: '-3%',
      status: 'warning'
    },
    systemHealth: {
      value: 99.2,
      unit: '%',
      trend: 'up',
      trendValue: '+0.1%',
      status: 'good'
    }
  });

  const handleRefreshChange = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleAreaChange = useCallback((area) => {
    setSelectedArea(area);
  }, []);

  const handleTimeRangeChange = useCallback((range) => {
    setTimeRange(range);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      
              <main className="p-8">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Operacioni Komandni Centar</h1>
            <p className="text-muted-foreground">
              Praćenje u realnom vremenu performansi isporuke usluga i operativne efikasnosti kroz sve aktivnosti platforme
            </p>
          </div>

          {/* Global Controls */}
          <GlobalControls
            onRefreshChange={handleRefreshChange}
            onAreaChange={handleAreaChange}
            onTimeRangeChange={handleTimeRangeChange}
            className="col-span-full"
          />

          {/* Status Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusMetricCard
              title="Aktivne Porudžbine"
              value={metrics?.activeOrders?.value}
              trend={metrics?.activeOrders?.trend}
              trendValue={metrics?.activeOrders?.trendValue}
              status={metrics?.activeOrders?.status}
              icon="ShoppingCart"
            />
            <StatusMetricCard
              title="Prosečno Vreme Isporuke"
              value={metrics?.avgDeliveryTime?.value}
              unit={metrics?.avgDeliveryTime?.unit}
              trend={metrics?.avgDeliveryTime?.trend}
              trendValue={metrics?.avgDeliveryTime?.trendValue}
              status={metrics?.avgDeliveryTime?.status}
              icon="Clock"
            />
            <StatusMetricCard
              title="Dostupnost Radnika"
              value={metrics?.workerAvailability?.value}
              unit={metrics?.workerAvailability?.unit}
              trend={metrics?.workerAvailability?.trend}
              trendValue={metrics?.workerAvailability?.trendValue}
              status={metrics?.workerAvailability?.status}
              icon="Users"
            />
            <StatusMetricCard
              title="Zdravlje Sistema"
              value={metrics?.systemHealth?.value}
              unit={metrics?.systemHealth?.unit}
              trend={metrics?.systemHealth?.trend}
              trendValue={metrics?.systemHealth?.trendValue}
              status={metrics?.systemHealth?.status}
              icon="Activity"
            />
          </div>

          {/* Main Monitoring Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Real-Time Chart */}
            <div className="lg:col-span-8">
              <RealTimeChart key={refreshTrigger} />
            </div>

            {/* Alert Feed Sidebar */}
            <div className="lg:col-span-4">
              <AlertFeed key={refreshTrigger} />
            </div>
          </div>

          {/* Active Orders Grid */}
          <div className="col-span-full">
            <ActiveOrdersGrid key={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OperationsCommandCenter;