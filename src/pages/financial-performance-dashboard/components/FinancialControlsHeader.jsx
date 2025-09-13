import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';
import GlobalDashboardControls from '../../../components/ui/GlobalDashboardControls';
import DataStatusIndicator from '../../../components/ui/DataStatusIndicator';
import ExportShareControls from '../../../components/ui/ExportShareControls';

const FinancialControlsHeader = ({ 
  onPeriodChange, 
  onCurrencyChange, 
  onComparisonChange,
  onRefresh 
}) => {
  const [fiscalPeriod, setFiscalPeriod] = useState('current-quarter');
  const [currency, setCurrency] = useState('USD');
  const [comparisonMode, setComparisonMode] = useState('MoM');
  const [lastUpdated] = useState(new Date(Date.now() - 15 * 60 * 1000)); // 15 minutes ago

  const fiscalPeriodOptions = [
    { value: 'current-month', label: 'Current Month' },
    { value: 'current-quarter', label: 'Current Quarter' },
    { value: 'current-year', label: 'Current Year' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'JPY', label: 'JPY (¥)' },
    { value: 'CAD', label: 'CAD (C$)' }
  ];

  const comparisonOptions = [
    { value: 'MoM', label: 'Month over Month' },
    { value: 'QoQ', label: 'Quarter over Quarter' },
    { value: 'YoY', label: 'Year over Year' },
    { value: 'custom', label: 'Custom Period' }
  ];

  const handlePeriodChange = (value) => {
    setFiscalPeriod(value);
    onPeriodChange?.(value);
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    onCurrencyChange?.(value);
  };

  const handleComparisonChange = (value) => {
    setComparisonMode(value);
    onComparisonChange?.(value);
  };

  const handleExport = (options) => {
    console.log('Exporting financial data:', options);
    // Simulate export process
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleShare = (options) => {
    console.log('Sharing financial dashboard:', options);
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="p-6">
        {/* Main Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard Finansijskih Performansi</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sveobuhvatno praćenje prihoda, analiza transakcija i uvid u profitabilnost
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <DataStatusIndicator
              connectionStatus="connected"
              lastUpdate={lastUpdated}
              dataFreshness="recent"
            />
            <ExportShareControls
              dashboardContext="financial-performance"
              onExport={handleExport}
              onShare={handleShare}
            />
          </div>
        </div>

        {/* Kontrole Specifične za Finansije */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Fiscal Period Selector */}
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <Select
                options={fiscalPeriodOptions}
                value={fiscalPeriod}
                onChange={handlePeriodChange}
                className="min-w-[160px]"
                placeholder="Select period"
              />
            </div>

            {/* Currency Toggle */}
            <div className="flex items-center space-x-2">
              <Icon name="DollarSign" size={16} className="text-muted-foreground" />
              <Select
                options={currencyOptions}
                value={currency}
                onChange={handleCurrencyChange}
                className="min-w-[100px]"
              />
            </div>

            {/* Comparison Mode */}
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
              <Select
                options={comparisonOptions}
                value={comparisonMode}
                onChange={handleComparisonChange}
                className="min-w-[140px]"
              />
            </div>
          </div>

          {/* Global Dashboard Controls */}
          <GlobalDashboardControls
            onRefresh={onRefresh}
            onDateRangeChange={() => {}}
            onRegionChange={() => {}}
            className="flex-shrink-0"
          />
        </div>

        {/* Brzi Finansijski Uvidi */}
        <div className="mt-4 flex items-center space-x-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                          <span>Praćenje transakcija u realnom vremenu aktivno</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={12} />
                          <span>Finansijski podaci šifrovani i spremni za reviziju</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={12} />
            <span>Data refreshes every 30 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialControlsHeader;