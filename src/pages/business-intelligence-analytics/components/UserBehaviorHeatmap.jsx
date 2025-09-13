import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const UserBehaviorHeatmap = ({ className = "" }) => {
  const [viewType, setViewType] = useState('hourly');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  const heatmapData = {
    hourly: [
      { hour: '00:00', monday: 15, tuesday: 12, wednesday: 18, thursday: 14, friday: 22, saturday: 45, sunday: 38 },
      { hour: '01:00', monday: 8, tuesday: 6, wednesday: 10, thursday: 9, friday: 15, saturday: 32, sunday: 28 },
      { hour: '02:00', monday: 5, tuesday: 4, wednesday: 7, thursday: 6, friday: 12, saturday: 25, sunday: 20 },
      { hour: '03:00', monday: 3, tuesday: 2, wednesday: 4, thursday: 3, friday: 8, saturday: 18, sunday: 15 },
      { hour: '04:00', monday: 2, tuesday: 1, wednesday: 3, thursday: 2, friday: 5, saturday: 12, sunday: 10 },
      { hour: '05:00', monday: 4, tuesday: 3, wednesday: 5, thursday: 4, friday: 8, saturday: 15, sunday: 12 },
      { hour: '06:00', monday: 12, tuesday: 15, wednesday: 18, thursday: 20, friday: 25, saturday: 28, sunday: 22 },
      { hour: '07:00', monday: 35, tuesday: 42, wednesday: 45, thursday: 48, friday: 52, saturday: 35, sunday: 28 },
      { hour: '08:00', monday: 65, tuesday: 72, wednesday: 75, thursday: 78, friday: 82, saturday: 45, sunday: 38 },
      { hour: '09:00', monday: 85, tuesday: 88, wednesday: 92, thursday: 95, friday: 98, saturday: 55, sunday: 48 },
      { hour: '10:00', monday: 92, tuesday: 95, wednesday: 98, thursday: 100, friday: 95, saturday: 65, sunday: 58 },
      { hour: '11:00', monday: 88, tuesday: 92, wednesday: 95, thursday: 98, friday: 92, saturday: 75, sunday: 68 },
      { hour: '12:00', monday: 95, tuesday: 98, wednesday: 100, thursday: 95, friday: 88, saturday: 85, sunday: 78 },
      { hour: '13:00', monday: 92, tuesday: 95, wednesday: 98, thursday: 92, friday: 85, saturday: 88, sunday: 82 },
      { hour: '14:00', monday: 88, tuesday: 92, wednesday: 95, thursday: 88, friday: 82, saturday: 92, sunday: 85 },
      { hour: '15:00', monday: 85, tuesday: 88, wednesday: 92, thursday: 85, friday: 78, saturday: 95, sunday: 88 },
      { hour: '16:00', monday: 82, tuesday: 85, wednesday: 88, thursday: 82, friday: 75, saturday: 98, sunday: 92 },
      { hour: '17:00', monday: 78, tuesday: 82, wednesday: 85, thursday: 78, friday: 72, saturday: 95, sunday: 88 },
      { hour: '18:00', monday: 75, tuesday: 78, wednesday: 82, thursday: 75, friday: 68, saturday: 92, sunday: 85 },
      { hour: '19:00', monday: 68, tuesday: 72, wednesday: 75, thursday: 68, friday: 62, saturday: 88, sunday: 82 },
      { hour: '20:00', monday: 55, tuesday: 58, wednesday: 62, thursday: 55, friday: 48, saturday: 75, sunday: 68 },
      { hour: '21:00', monday: 42, tuesday: 45, wednesday: 48, thursday: 42, friday: 38, saturday: 62, sunday: 55 },
      { hour: '22:00', monday: 32, tuesday: 35, wednesday: 38, thursday: 32, friday: 28, saturday: 52, sunday: 45 },
      { hour: '23:00', monday: 22, tuesday: 25, wednesday: 28, thursday: 22, friday: 18, saturday: 42, sunday: 35 }
    ]
  };

  const viewTypeOptions = [
    { value: 'hourly', label: 'Hourly Pattern' },
    { value: 'daily', label: 'Daily Pattern' },
    { value: 'weekly', label: 'Weekly Pattern' }
  ];

  const metricOptions = [
    { value: 'engagement', label: 'User Engagement' },
    { value: 'orders', label: 'Order Volume' },
    { value: 'revenue', label: 'Revenue Intensity' },
    { value: 'conversion', label: 'Conversion Rate' }
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getIntensityColor = (value) => {
    if (value >= 90) return 'bg-primary';
    if (value >= 75) return 'bg-primary/80';
    if (value >= 60) return 'bg-primary/60';
    if (value >= 45) return 'bg-primary/40';
    if (value >= 30) return 'bg-primary/30';
    if (value >= 15) return 'bg-primary/20';
    return 'bg-primary/10';
  };

  const getTextColor = (value) => {
    return value >= 60 ? 'text-primary-foreground' : 'text-card-foreground';
  };

  const maxValue = Math.max(...heatmapData?.hourly?.flatMap(row => 
    days?.map(day => row?.[day])
  ));

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <Icon name="Activity" size={24} className="text-primary" />
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">User Behavior Heatmap</h3>
            <p className="text-sm text-muted-foreground">Activity patterns across time and days</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={viewTypeOptions}
            value={viewType}
            onChange={setViewType}
            className="min-w-[140px]"
          />
          
          <Select
            options={metricOptions}
            value={selectedMetric}
            onChange={setSelectedMetric}
            className="min-w-[140px]"
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
      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="h-8"></div> {/* Empty cell for hour column */}
            {dayLabels?.map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="space-y-1">
            {heatmapData?.hourly?.map((row, index) => (
              <div key={row?.hour} className="grid grid-cols-8 gap-1">
                {/* Hour Label */}
                <div className="h-8 flex items-center justify-end pr-2 text-xs text-muted-foreground font-mono">
                  {row?.hour}
                </div>
                
                {/* Day Cells */}
                {days?.map((day) => (
                  <div
                    key={`${row?.hour}-${day}`}
                    className={`h-8 rounded flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${getIntensityColor(row?.[day])} ${getTextColor(row?.[day])}`}
                    title={`${dayLabels?.[days?.indexOf(day)]} ${row?.hour}: ${row?.[day]}% activity`}
                  >
                    {row?.[day]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Activity Level:</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Low</span>
            <div className="flex space-x-1">
              <div className="w-4 h-4 rounded bg-primary/10"></div>
              <div className="w-4 h-4 rounded bg-primary/20"></div>
              <div className="w-4 h-4 rounded bg-primary/40"></div>
              <div className="w-4 h-4 rounded bg-primary/60"></div>
              <div className="w-4 h-4 rounded bg-primary/80"></div>
              <div className="w-4 h-4 rounded bg-primary"></div>
            </div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-muted-foreground">Peak: {maxValue}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-muted-foreground">Updated: 2 min ago</span>
          </div>
        </div>
      </div>
      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Sun" size={16} className="text-warning" />
            <span className="text-sm font-medium text-card-foreground">Peak Hours</span>
          </div>
          <p className="text-xs text-muted-foreground">Highest activity between 10 AM - 2 PM on weekdays</p>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" size={16} className="text-primary" />
            <span className="text-sm font-medium text-card-foreground">Weekend Pattern</span>
          </div>
          <p className="text-xs text-muted-foreground">Saturday shows 35% higher evening activity than weekdays</p>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Moon" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-card-foreground">Low Activity</span>
          </div>
          <p className="text-xs text-muted-foreground">Minimal usage between 2 AM - 5 AM across all days</p>
        </div>
      </div>
    </div>
  );
};

export default UserBehaviorHeatmap;