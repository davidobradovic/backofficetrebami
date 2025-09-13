import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedFilterPanel = ({ onFiltersChange, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '30d',
    customStartDate: '',
    customEndDate: '',
    categories: [],
    subcategories: [],
    userSegments: [],
    cohortPeriod: 'monthly',
    regions: [],
    workerTiers: []
  });

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const categoryOptions = [
    { value: 'home-services', label: 'Home Services' },
    { value: 'delivery', label: 'Delivery & Logistics' },
    { value: 'beauty-wellness', label: 'Beauty & Wellness' },
    { value: 'automotive', label: 'Automotive Services' },
    { value: 'professional', label: 'Professional Services' }
  ];

  const subcategoryOptions = [
    { value: 'cleaning', label: 'House Cleaning' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical Work' },
    { value: 'food-delivery', label: 'Food Delivery' },
    { value: 'package-delivery', label: 'Package Delivery' },
    { value: 'massage', label: 'Massage Therapy' },
    { value: 'haircut', label: 'Hair Services' },
    { value: 'car-wash', label: 'Car Wash' },
    { value: 'consulting', label: 'Business Consulting' }
  ];

  const userSegmentOptions = [
    { value: 'new-users', label: 'New Users (0-30 days)' },
    { value: 'active-users', label: 'Active Users (30-90 days)' },
    { value: 'loyal-users', label: 'Loyal Users (90+ days)' },
    { value: 'high-value', label: 'High Value Users' },
    { value: 'at-risk', label: 'At-Risk Users' }
  ];

  const cohortPeriodOptions = [
    { value: 'weekly', label: 'Weekly Cohorts' },
    { value: 'monthly', label: 'Monthly Cohorts' },
    { value: 'quarterly', label: 'Quarterly Cohorts' }
  ];

  const regionOptions = [
    { value: 'beograd', label: 'Beograd' },
    { value: 'vojvodina', label: 'Vojvodina' },
    { value: 'sumadija', label: 'Šumadija' },
    { value: 'juzna-srbija', label: 'Južna Srbija' }
  ];

  const workerTierOptions = [
    { value: 'bronze', label: 'Bronze Tier' },
    { value: 'silver', label: 'Silver Tier' },
    { value: 'gold', label: 'Gold Tier' },
    { value: 'platinum', label: 'Platinum Tier' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleMultiSelectChange = (key, value, checked) => {
    const currentValues = filters?.[key] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues?.filter(v => v !== value);
    
    handleFilterChange(key, newValues);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      dateRange: '30d',
      customStartDate: '',
      customEndDate: '',
      categories: [],
      subcategories: [],
      userSegments: [],
      cohortPeriod: 'monthly',
      regions: [],
      workerTiers: []
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.categories?.length > 0) count++;
    if (filters?.subcategories?.length > 0) count++;
    if (filters?.userSegments?.length > 0) count++;
    if (filters?.regions?.length > 0) count++;
    if (filters?.workerTiers?.length > 0) count++;
    if (filters?.dateRange === 'custom' && filters?.customStartDate && filters?.customEndDate) count++;
    return count;
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Advanced Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            iconName="X"
            className="text-muted-foreground"
          >
            Clear All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      {/* Quick Filters */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />
          
          <Select
            label="Cohort Analysis"
            options={cohortPeriodOptions}
            value={filters?.cohortPeriod}
            onChange={(value) => handleFilterChange('cohortPeriod', value)}
          />

          <div className="md:col-span-2">
            {filters?.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Start Date"
                  type="date"
                  value={filters?.customStartDate}
                  onChange={(e) => handleFilterChange('customStartDate', e?.target?.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={filters?.customEndDate}
                  onChange={(e) => handleFilterChange('customEndDate', e?.target?.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-3">Categories</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {categoryOptions?.map((option) => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={filters?.categories?.includes(option?.value)}
                  onChange={(e) => handleMultiSelectChange('categories', option?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Subcategories */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-3">Subcategories</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {subcategoryOptions?.map((option) => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={filters?.subcategories?.includes(option?.value)}
                  onChange={(e) => handleMultiSelectChange('subcategories', option?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* User Segments */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-3">User Segments</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {userSegmentOptions?.map((option) => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={filters?.userSegments?.includes(option?.value)}
                  onChange={(e) => handleMultiSelectChange('userSegments', option?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Regions */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-3">Regions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {regionOptions?.map((option) => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={filters?.regions?.includes(option?.value)}
                  onChange={(e) => handleMultiSelectChange('regions', option?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Worker Tiers */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-3">Worker Performance Tiers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {workerTierOptions?.map((option) => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={filters?.workerTiers?.includes(option?.value)}
                  onChange={(e) => handleMultiSelectChange('workerTiers', option?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilterPanel;