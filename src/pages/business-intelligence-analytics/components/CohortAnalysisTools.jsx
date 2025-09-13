import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CohortAnalysisTools = ({ className = "" }) => {
  const [cohortType, setCohortType] = useState('acquisition');
  const [timeGranularity, setTimeGranularity] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('retention');

  const cohortData = {
    acquisition: [
      { 
        cohort: 'Jan 2024', 
        size: 1250, 
        month0: 100, month1: 78, month2: 65, month3: 58, month6: 45, month12: 32,
        revenue0: 125000, revenue1: 97500, revenue2: 81250, revenue3: 72500, revenue6: 56250, revenue12: 40000
      },
      { 
        cohort: 'Feb 2024', 
        size: 1380, 
        month0: 100, month1: 82, month2: 68, month3: 62, month6: 48, month12: 35,
        revenue0: 138000, revenue1: 113160, revenue2: 93840, revenue3: 85560, revenue6: 66240, revenue12: 48300
      },
      { 
        cohort: 'Mar 2024', 
        size: 1180, 
        month0: 100, month1: 75, month2: 62, month3: 55, month6: 42, month12: 28,
        revenue0: 118000, revenue1: 88500, revenue2: 73160, revenue3: 64900, revenue6: 49560, revenue12: 33040
      },
      { 
        cohort: 'Apr 2024', 
        size: 1520, 
        month0: 100, month1: 85, month2: 72, month3: 65, month6: 52, month12: null,
        revenue0: 152000, revenue1: 129200, revenue2: 109440, revenue3: 98800, revenue6: 79040, revenue12: null
      },
      { 
        cohort: 'May 2024', 
        size: 1680, 
        month0: 100, month1: 88, month2: 75, month3: 68, month6: 55, month12: null,
        revenue0: 168000, revenue1: 147840, revenue2: 126000, revenue3: 114240, revenue6: 92400, revenue12: null
      },
      { 
        cohort: 'Jun 2024', 
        size: 1750, 
        month0: 100, month1: 90, month2: 78, month3: 72, month6: null, month12: null,
        revenue0: 175000, revenue1: 157500, revenue2: 136500, revenue3: 126000, revenue6: null, revenue12: null
      },
      { 
        cohort: 'Jul 2024', 
        size: 1820, 
        month0: 100, month1: 87, month2: 74, month3: null, month6: null, month12: null,
        revenue0: 182000, revenue1: 158340, revenue2: 134680, revenue3: null, revenue6: null, revenue12: null
      },
      { 
        cohort: 'Aug 2024', 
        size: 1950, 
        month0: 100, month1: 92, month2: null, month3: null, month6: null, month12: null,
        revenue0: 195000, revenue1: 179400, revenue2: null, revenue3: null, revenue6: null, revenue12: null
      }
    ]
  };

  const cohortTypeOptions = [
    { value: 'acquisition', label: 'Acquisition Cohorts' },
    { value: 'behavioral', label: 'Behavioral Cohorts' },
    { value: 'revenue', label: 'Revenue Cohorts' }
  ];

  const granularityOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const metricOptions = [
    { value: 'retention', label: 'Retention Rate (%)' },
    { value: 'revenue', label: 'Revenue per Cohort ($)' },
    { value: 'ltv', label: 'Lifetime Value ($)' }
  ];

  const timeColumns = ['month0', 'month1', 'month2', 'month3', 'month6', 'month12'];
  const timeLabels = ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 6', 'Month 12'];

  const getIntensityColor = (value, isRevenue = false) => {
    if (value === null || value === undefined) return 'bg-muted text-muted-foreground';
    
    if (isRevenue) {
      if (value >= 150000) return 'bg-success text-success-foreground';
      if (value >= 100000) return 'bg-success/80 text-success-foreground';
      if (value >= 75000) return 'bg-warning text-warning-foreground';
      if (value >= 50000) return 'bg-warning/60 text-warning-foreground';
      return 'bg-error/60 text-error-foreground';
    } else {
      if (value >= 80) return 'bg-success text-success-foreground';
      if (value >= 60) return 'bg-success/80 text-success-foreground';
      if (value >= 40) return 'bg-warning text-warning-foreground';
      if (value >= 20) return 'bg-warning/60 text-warning-foreground';
      return 'bg-error/60 text-error-foreground';
    }
  };

  const formatValue = (value, metric) => {
    if (value === null || value === undefined) return '-';
    
    switch (metric) {
      case 'retention':
        return `${value}%`;
      case 'revenue':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        })?.format(value);
      default:
        return value;
    }
  };

  const getValue = (cohort, timeColumn, metric) => {
    if (metric === 'revenue') {
      return cohort?.[`revenue${timeColumn?.replace('month', '')}`];
    }
    return cohort?.[timeColumn];
  };

  const calculateAverageRetention = (timeColumn) => {
    const validValues = cohortData?.acquisition?.map(cohort => cohort?.[timeColumn])?.filter(val => val !== null && val !== undefined);
    
    if (validValues?.length === 0) return null;
    return (validValues?.reduce((sum, val) => sum + val, 0) / validValues?.length)?.toFixed(1);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <Icon name="BarChart3" size={24} className="text-primary" />
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">Cohort Analysis Tools</h3>
            <p className="text-sm text-muted-foreground">Customer retention and behavior analysis</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={cohortTypeOptions}
            value={cohortType}
            onChange={setCohortType}
            className="min-w-[150px]"
          />
          
          <Select
            options={granularityOptions}
            value={timeGranularity}
            onChange={setTimeGranularity}
            className="min-w-[120px]"
          />
          
          <Select
            options={metricOptions}
            value={selectedMetric}
            onChange={setSelectedMetric}
            className="min-w-[160px]"
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
      {/* Cohort Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-muted-foreground font-medium sticky left-0 bg-card">Cohort</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Size</th>
              {timeLabels?.map((label) => (
                <th key={label} className="text-center p-3 text-muted-foreground font-medium min-w-[100px]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohortData?.acquisition?.map((cohort, index) => (
              <tr key={index} className="border-b border-border/50 hover:bg-accent/20">
                <td className="p-3 font-medium text-card-foreground sticky left-0 bg-card">
                  {cohort?.cohort}
                </td>
                <td className="p-3 text-right text-muted-foreground">
                  {new Intl.NumberFormat('en-US')?.format(cohort?.size)}
                </td>
                {timeColumns?.map((timeCol) => {
                  const value = getValue(cohort, timeCol, selectedMetric);
                  return (
                    <td key={timeCol} className="p-3 text-center">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getIntensityColor(value, selectedMetric === 'revenue')}`}>
                        {formatValue(value, selectedMetric)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {/* Average Row */}
            <tr className="border-t-2 border-primary/20 bg-accent/20">
              <td className="p-3 font-bold text-card-foreground sticky left-0 bg-accent/20">
                Average
              </td>
              <td className="p-3 text-right text-muted-foreground">
                {new Intl.NumberFormat('en-US')?.format(
                  Math.round(cohortData?.acquisition?.reduce((sum, c) => sum + c?.size, 0) / cohortData?.acquisition?.length)
                )}
              </td>
              {timeColumns?.map((timeCol) => {
                const avgValue = calculateAverageRetention(timeCol);
                return (
                  <td key={timeCol} className="p-3 text-center">
                    <div className="px-2 py-1 rounded text-xs font-bold bg-primary/20 text-primary">
                      {avgValue ? `${avgValue}%` : '-'}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Users" size={16} className="text-primary" />
            <span className="text-sm font-medium text-card-foreground">Avg Cohort Size</span>
          </div>
          <p className="text-lg font-bold text-primary">1,566</p>
          <p className="text-xs text-muted-foreground">+12.5% vs last period</p>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-card-foreground">Month 1 Retention</span>
          </div>
          <p className="text-lg font-bold text-success">84.2%</p>
          <p className="text-xs text-muted-foreground">Above industry avg</p>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" size={16} className="text-warning" />
            <span className="text-sm font-medium text-card-foreground">Month 6 Retention</span>
          </div>
          <p className="text-lg font-bold text-warning">50.5%</p>
          <p className="text-xs text-muted-foreground">Needs improvement</p>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-card-foreground">Avg LTV</span>
          </div>
          <p className="text-lg font-bold text-secondary">$285</p>
          <p className="text-xs text-muted-foreground">Per customer</p>
        </div>
      </div>
      {/* Analysis Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-border">
        <div>
          <h4 className="text-lg font-medium text-card-foreground mb-4">Retention Trends</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
              <span className="text-sm text-card-foreground">Best Performing Cohort</span>
              <span className="font-medium text-success">Aug 2024 (92% Month 1)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
              <span className="text-sm text-card-foreground">Steepest Drop-off</span>
              <span className="font-medium text-warning">Month 0 → Month 1 (16%)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
              <span className="text-sm text-card-foreground">Stabilization Point</span>
              <span className="font-medium text-primary">Month 3 (Avg 62%)</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-card-foreground mb-4">Recommendations</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-accent/20 rounded-lg">
              <Icon name="Target" size={16} className="text-success mt-0.5" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Improve Month 1 Onboarding</p>
                <p className="text-xs text-muted-foreground">Focus on user activation in first 30 days</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-accent/20 rounded-lg">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Address Month 6 Churn</p>
                <p className="text-xs text-muted-foreground">Implement re-engagement campaigns</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-accent/20 rounded-lg">
              <Icon name="TrendingUp" size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Replicate Aug Success</p>
                <p className="text-xs text-muted-foreground">Analyze Aug 2024 cohort strategies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortAnalysisTools;