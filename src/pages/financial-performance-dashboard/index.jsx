import React, { useState, useEffect } from 'react';

import FinancialControlsHeader from './components/FinancialControlsHeader';
import FinancialMetricsStrip from './components/FinancialMetricsStrip';
import RevenueWaterfallChart from './components/RevenueWaterfallChart';
import PaymentMethodChart from './components/PaymentMethodChart';
import RecentTransactionsFeed from './components/RecentTransactionsFeed';
import MonthlyRecurringRevenue from './components/MonthlyRecurringRevenue';
import CategoryProfitabilityAnalysis from './components/CategoryProfitabilityAnalysis';
import RegionalFinancialPerformance from './components/RegionalFinancialPerformance';

const FinancialPerformanceDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-quarter');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [comparisonMode, setComparisonMode] = useState('MoM');
  const [isLoading, setIsLoading] = useState(false);

  // Mock Financial Metrics Data
  const financialMetrics = [
    {
      id: 'total-revenue',
      label: 'Ukupan Prihod',
      value: 2847500,
      type: 'currency',
      variance: 12.4,
      comparison: 'prošli mesec',
      icon: 'DollarSign',
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      sparkline: [85, 92, 78, 96, 88, 94, 100, 89, 95, 91, 97, 100]
    },
    {
      id: 'transaction-volume',
      label: 'Obim Transakcija',
      value: 45678,
      type: 'number',
      variance: 8.7,
      comparison: 'prošli mesec',
      icon: 'CreditCard',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      sparkline: [78, 85, 92, 88, 95, 91, 97, 89, 94, 100, 96, 98]
    },
    {
      id: 'avg-order-value',
      label: 'Prosečna Vrednost Porudžbine',
      value: 62.35,
      type: 'currency',
      variance: -2.1,
      comparison: 'prošli mesec',
      icon: 'ShoppingCart',
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      sparkline: [100, 95, 98, 92, 89, 94, 91, 88, 85, 90, 87, 89]
    },
    {
      id: 'profit-margin',
      label: 'Profitna Marža',
      value: 23.8,
      type: 'percentage',
      variance: 3.2,
      comparison: 'prošli kvartal',
      icon: 'TrendingUp',
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      sparkline: [82, 85, 88, 91, 89, 94, 97, 95, 98, 100, 96, 99]
    },
    {
      id: 'payment-success-rate',
      label: 'Stopa Uspesnosti Plaćanja',
      value: 97.2,
      type: 'percentage',
      variance: 0.8,
      comparison: 'prošli mesec',
      icon: 'CheckCircle',
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      sparkline: [95, 96, 97, 95, 98, 97, 99, 98, 97, 98, 99, 100]
    },
    {
      id: 'chargeback-ratio',
      label: 'Stopa Povraćaja',
      value: 0.34,
      type: 'percentage',
      variance: -15.2,
      comparison: 'prošli mesec',
      icon: 'AlertTriangle',
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/10',
      sparkline: [100, 95, 92, 88, 85, 82, 78, 75, 72, 68, 65, 62]
    }
  ];

  // Mock Revenue Waterfall Data
  const revenueWaterfallData = [
    { name: 'Početni Prihod', value: 2450000, type: 'starting', description: 'Prihod iz prethodnog perioda' },
    { name: 'Novi Kupci', value: 485000, type: 'positive', description: 'Prihod od novih kupaca' },
    { name: 'Dodatne Usluge', value: 125000, type: 'positive', description: 'Dodatni prihod od postojećih kupaca' },
    { name: 'Dopunske Usluge', value: 89000, type: 'positive', description: 'Prihod od dopunskih usluga' },
    { name: 'Gubitak Kupaca', value: -156000, type: 'negative', description: 'Izgubljeni prihod od gubitka kupaca' },
    { name: 'Smanjenje Planova', value: -67000, type: 'negative', description: 'Smanjenje prihoda od smanjenja planova' },
    { name: 'Povraćaji', value: -78500, type: 'negative', description: 'Izgubljeni prihod od povraćaja' },
    { name: 'Neto Prihod', value: 2847500, type: 'ending', description: 'Konačan prihod za trenutni period' }
  ];

  // Mock Payment Method Data
  const paymentMethodData = [
    { name: 'Kreditna Kartica', value: 1654200, percentage: 58.1 },
    { name: 'Digitalni Novčanik', value: 739500, percentage: 26.0 },
    { name: 'Bankovni Transfer', value: 284750, percentage: 10.0 },
    { name: 'PayPal', value: 142375, percentage: 5.0 },
    { name: 'Ostalo', value: 26675, percentage: 0.9 }
  ];

  // Mock Recent Transactions Data
  const recentTransactions = [
    {
      id: 'TXN-2024-001234',
      description: 'Premium Pretplata na Usluge',
      amount: 299.99,
      paymentMethod: 'Credit Card',
      status: 'completed',
      transactionId: '4532-1234',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: 'TXN-2024-001235',
      description: 'Usluga Čišćenja Kuće',
      amount: 89.50,
      paymentMethod: 'Digitalni Novčanik',
      status: 'completed',
      transactionId: '4532-1235',
      timestamp: new Date(Date.now() - 12 * 60 * 1000)
    },
    {
      id: 'TXN-2024-001236',
      description: 'Naknada za Uslugu Dostave',
      amount: 15.75,
      paymentMethod: 'Credit Card',
      status: 'pending',
      transactionId: '4532-1236',
      timestamp: new Date(Date.now() - 18 * 60 * 1000)
    },
    {
      id: 'TXN-2024-001237',
      description: 'Povraćaj - Otkazana Porudžbina',
      amount: -45.00,
      paymentMethod: 'PayPal',
      status: 'refunded',
      transactionId: '4532-1237',
      timestamp: new Date(Date.now() - 25 * 60 * 1000)
    },
    {
      id: 'TXN-2024-001238',
      description: 'Profesionalna Konsultacija',
      amount: 150.00,
      paymentMethod: 'Bankovni Transfer',
      status: 'failed',
      transactionId: '4532-1238',
      timestamp: new Date(Date.now() - 35 * 60 * 1000)
    },
    {
      id: 'TXN-2024-001239',
      description: 'Mesečna Pretplata',
      amount: 49.99,
      paymentMethod: 'Credit Card',
      status: 'completed',
      transactionId: '4532-1239',
      timestamp: new Date(Date.now() - 42 * 60 * 1000)
    }
  ];

  // Mock MRR Data
  const mrrData = [
    { month: 'Jan', mrr: 125000, newMrr: 15000, churnMrr: 8000, growth: 5.6 },
    { month: 'Feb', mrr: 132000, newMrr: 18000, churnMrr: 11000, growth: 5.6 },
    { month: 'Mar', mrr: 139500, newMrr: 16500, churnMrr: 9000, growth: 5.7 },
    { month: 'Apr', mrr: 147200, newMrr: 19200, churnMrr: 11500, growth: 5.5 },
    { month: 'May', mrr: 155800, newMrr: 21100, churnMrr: 12500, growth: 5.8 },
    { month: 'Jun', mrr: 164900, newMrr: 22400, churnMrr: 13300, growth: 5.8 },
    { month: 'Jul', mrr: 174500, newMrr: 24100, churnMrr: 14500, growth: 5.8 },
    { month: 'Aug', mrr: 184800, newMrr: 25800, churnMrr: 15500, growth: 5.9 }
  ];

  // Mock Category Profitability Data
  const categoryProfitabilityData = [
    {
      category: 'Kućne Usluge',
      revenue: 845000,
      costs: 592000,
      profit: 253000,
      margin: 29.9,
      orders: 12450
    },
    {
      category: 'Food Delivery',
      revenue: 675000,
      costs: 540000,
      profit: 135000,
      margin: 20.0,
      orders: 28900
    },
    {
      category: 'Transport',
      revenue: 520000,
      costs: 390000,
      profit: 130000,
      margin: 25.0,
      orders: 15600
    },
    {
      category: 'Profesionalne Usluge',
      revenue: 485000,
      costs: 315000,
      profit: 170000,
      margin: 35.1,
      orders: 3200
    },
    {
      category: 'Lepota i Wellness',
      revenue: 322500,
      costs: 225750,
      profit: 96750,
      margin: 30.0,
      orders: 5800
    }
  ];

  // Mock Regional Performance Data
  const regionalPerformanceData = [
    {
              region: 'Beograd',
      revenue: 1425000,
      profit: 342000,
      orders: 32500,
      growth: 12.4
    },
    {
      region: 'Vojvodina',
      revenue: 856000,
      profit: 188320,
      orders: 19800,
      growth: 8.7
    },
    {
      region: 'Šumadija',
      revenue: 425000,
      profit: 89250,
      orders: 11200,
      growth: 15.2
    },
    {
      region: 'Južna Srbija',
      revenue: 141500,
      profit: 24055,
      orders: 4100,
      growth: 22.8
    }
  ];

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // Simulate data refresh
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const handleComparisonChange = (mode) => {
    setComparisonMode(mode);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  useEffect(() => {
    document.title = 'Financial Performance Dashboard - Trebami Admin Analytics';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      
      
              <div className="p-8">
        <FinancialControlsHeader
          onPeriodChange={handlePeriodChange}
          onCurrencyChange={handleCurrencyChange}
          onComparisonChange={handleComparisonChange}
          onRefresh={handleRefresh}
        />

        <div className="p-6 space-y-6">
          {/* Financial Metrics Strip */}
          <FinancialMetricsStrip metrics={financialMetrics} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Revenue Waterfall Chart - 9 columns */}
            <div className="xl:col-span-9">
              <RevenueWaterfallChart 
                data={revenueWaterfallData} 
                selectedPeriod={selectedPeriod}
              />
            </div>

            {/* Right Panel - 3 columns */}
            <div className="xl:col-span-3 space-y-6">
              <PaymentMethodChart data={paymentMethodData} />
              <RecentTransactionsFeed transactions={recentTransactions} />
            </div>
          </div>

          {/* Secondary Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MonthlyRecurringRevenue 
              data={mrrData} 
              growthRate={5.8}
            />
            <CategoryProfitabilityAnalysis data={categoryProfitabilityData} />
            <RegionalFinancialPerformance data={regionalPerformanceData} />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-foreground">Refreshing financial data...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPerformanceDashboard;