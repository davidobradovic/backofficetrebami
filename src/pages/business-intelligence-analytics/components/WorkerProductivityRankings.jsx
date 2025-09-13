import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';
import Image from '../../../components/AppImage';

const WorkerProductivityRankings = ({ className = "" }) => {
  const [sortBy, setSortBy] = useState('productivity_score');
  const [timeframe, setTimeframe] = useState('30d');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const workerData = [
    {
      id: 'W001',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      category: 'Home Services',
      productivityScore: 98.5,
      completedJobs: 145,
      avgRating: 4.9,
      responseTime: 2.3,
      revenue: 14500,
      tier: 'Platinum',
      efficiency: 96.2,
      customerSatisfaction: 98.1
    },
    {
      id: 'W002',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      category: 'Delivery',
      productivityScore: 95.8,
      completedJobs: 189,
      avgRating: 4.8,
      responseTime: 1.8,
      revenue: 12800,
      tier: 'Platinum',
      efficiency: 94.5,
      customerSatisfaction: 96.8
    },
    {
      id: 'W003',
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      category: 'Beauty & Wellness',
      productivityScore: 93.2,
      completedJobs: 98,
      avgRating: 4.9,
      responseTime: 3.1,
      revenue: 18900,
      tier: 'Gold',
      efficiency: 91.8,
      customerSatisfaction: 97.5
    },
    {
      id: 'W004',
      name: 'David Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      category: 'Automotive',
      productivityScore: 91.7,
      completedJobs: 76,
      avgRating: 4.7,
      responseTime: 4.2,
      revenue: 15600,
      tier: 'Gold',
      efficiency: 89.3,
      customerSatisfaction: 94.2
    },
    {
      id: 'W005',
      name: 'Lisa Wang',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      category: 'Professional Services',
      productivityScore: 89.4,
      completedJobs: 52,
      avgRating: 4.8,
      responseTime: 2.9,
      revenue: 22400,
      tier: 'Gold',
      efficiency: 87.6,
      customerSatisfaction: 95.8
    },
    {
      id: 'W006',
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      category: 'Home Services',
      productivityScore: 87.9,
      completedJobs: 112,
      avgRating: 4.6,
      responseTime: 3.8,
      revenue: 11200,
      tier: 'Silver',
      efficiency: 85.4,
      customerSatisfaction: 92.1
    },
    {
      id: 'W007',
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
      category: 'Delivery',
      productivityScore: 85.6,
      completedJobs: 156,
      avgRating: 4.5,
      responseTime: 2.1,
      revenue: 9800,
      tier: 'Silver',
      efficiency: 83.2,
      customerSatisfaction: 90.7
    },
    {
      id: 'W008',
      name: 'Robert Kim',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150',
      category: 'Beauty & Wellness',
      productivityScore: 83.1,
      completedJobs: 67,
      avgRating: 4.4,
      responseTime: 4.5,
      revenue: 13400,
      tier: 'Silver',
      efficiency: 81.8,
      customerSatisfaction: 88.9
    }
  ];

  const sortOptions = [
    { value: 'productivity_score', label: 'Productivity Score' },
    { value: 'completed_jobs', label: 'Completed Jobs' },
    { value: 'avg_rating', label: 'Average Rating' },
    { value: 'revenue', label: 'Revenue Generated' },
    { value: 'efficiency', label: 'Efficiency Rate' }
  ];

  const timeframeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'home-services', label: 'Home Services' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'beauty-wellness', label: 'Beauty & Wellness' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'professional', label: 'Professional Services' }
  ];

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Platinum': return 'bg-primary text-primary-foreground';
      case 'Gold': return 'bg-warning text-warning-foreground';
      case 'Silver': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Platinum': return 'Crown';
      case 'Gold': return 'Award';
      case 'Silver': return 'Medal';
      default: return 'User';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(value);
  };

  const sortedWorkers = [...workerData]?.sort((a, b) => {
    switch (sortBy) {
      case 'productivity_score':
        return b?.productivityScore - a?.productivityScore;
      case 'completed_jobs':
        return b?.completedJobs - a?.completedJobs;
      case 'avg_rating':
        return b?.avgRating - a?.avgRating;
      case 'revenue':
        return b?.revenue - a?.revenue;
      case 'efficiency':
        return b?.efficiency - a?.efficiency;
      default:
        return b?.productivityScore - a?.productivityScore;
    }
  });

  const chartData = sortedWorkers?.slice(0, 6)?.map(worker => ({
    name: worker?.name?.split(' ')?.[0],
    score: worker?.productivityScore,
    jobs: worker?.completedJobs,
    revenue: worker?.revenue / 1000
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const worker = sortedWorkers?.find(w => w?.name?.split(' ')?.[0] === label);
      if (worker) {
        return (
          <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
            <p className="font-medium text-popover-foreground mb-2">{worker?.name}</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Score:</span>
                <span className="font-medium text-popover-foreground">{worker?.productivityScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jobs:</span>
                <span className="font-medium text-popover-foreground">{worker?.completedJobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-medium text-popover-foreground">{formatCurrency(worker?.revenue)}</span>
              </div>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <Icon name="Users" size={24} className="text-primary" />
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">Worker Productivity Rankings</h3>
            <p className="text-sm text-muted-foreground">Performance analysis and rankings</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            className="min-w-[150px]"
          />
          
          <Select
            options={timeframeOptions}
            value={timeframe}
            onChange={setTimeframe}
            className="min-w-[130px]"
          />
          
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
            className="min-w-[140px]"
          />
        </div>
      </div>
      {/* Top Performers Chart */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-card-foreground mb-4">Top 6 Performers</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
                name="Productivity Score"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Detailed Rankings Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-muted-foreground font-medium">Rank</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Worker</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Category</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Score</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Jobs</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Rating</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Response</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Revenue</th>
              <th className="text-center p-3 text-muted-foreground font-medium">Tier</th>
            </tr>
          </thead>
          <tbody>
            {sortedWorkers?.map((worker, index) => (
              <tr key={worker?.id} className="border-b border-border/50 hover:bg-accent/20">
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-warning text-warning-foreground' :
                      index === 1 ? 'bg-secondary text-secondary-foreground' :
                      index === 2 ? 'bg-primary/20 text-primary': 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </span>
                    {index < 3 && (
                      <Icon 
                        name={index === 0 ? 'Trophy' : index === 1 ? 'Award' : 'Medal'} 
                        size={16} 
                        className={index === 0 ? 'text-warning' : index === 1 ? 'text-secondary' : 'text-primary'}
                      />
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={worker?.avatar}
                      alt={worker?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-card-foreground">{worker?.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {worker?.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className="text-sm text-card-foreground">{worker?.category}</span>
                </td>
                <td className="p-3 text-right">
                  <span className="font-bold text-primary">{worker?.productivityScore}</span>
                </td>
                <td className="p-3 text-right">
                  <span className="text-card-foreground">{worker?.completedJobs}</span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-card-foreground">{worker?.avgRating}</span>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <span className={`text-sm ${
                    worker?.responseTime <= 2 ? 'text-success' :
                    worker?.responseTime <= 3 ? 'text-warning': 'text-error'
                  }`}>
                    {worker?.responseTime}m
                  </span>
                </td>
                <td className="p-3 text-right">
                  <span className="font-medium text-card-foreground">{formatCurrency(worker?.revenue)}</span>
                </td>
                <td className="p-3 text-center">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTierColor(worker?.tier)}`}>
                    <Icon name={getTierIcon(worker?.tier)} size={12} />
                    <span>{worker?.tier}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="Trophy" size={20} className="text-warning" />
            <span className="text-lg font-semibold text-card-foreground">3</span>
          </div>
          <p className="text-sm text-muted-foreground">Platinum Workers</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={20} className="text-success" />
            <span className="text-lg font-semibold text-success">91.2</span>
          </div>
          <p className="text-sm text-muted-foreground">Avg Score</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="Clock" size={20} className="text-primary" />
            <span className="text-lg font-semibold text-primary">3.1m</span>
          </div>
          <p className="text-sm text-muted-foreground">Avg Response</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="DollarSign" size={20} className="text-warning" />
            <span className="text-lg font-semibold text-warning">$14.8K</span>
          </div>
          <p className="text-sm text-muted-foreground">Avg Revenue</p>
        </div>
      </div>
    </div>
  );
};

export default WorkerProductivityRankings;