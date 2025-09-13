import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const RealTimeChart = ({ className = '' }) => {
  const [chartData, setChartData] = useState([]);
  const [isLive, setIsLive] = useState(true);

  // Mock real-time data generation
  useEffect(() => {
    const generateInitialData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        data?.push({
          time: time?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          completionRate: Math.floor(Math.random() * 20) + 75,
          avgDeliveryTime: Math.floor(Math.random() * 10) + 25,
          timestamp: time?.getTime()
        });
      }
      return data;
    };

    setChartData(generateInitialData());

    const interval = setInterval(() => {
      if (isLive) {
        setChartData(prevData => {
          const newData = [...prevData];
          const now = new Date();
          
          // Remove oldest point and add new one
          newData?.shift();
          newData?.push({
            time: now?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            completionRate: Math.floor(Math.random() * 20) + 75,
            avgDeliveryTime: Math.floor(Math.random() * 10) + 25,
            timestamp: now?.getTime()
          });
          
          return newData;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">{`Time: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value}${entry?.dataKey === 'completionRate' ? '%' : ' min'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Real-Time Performance</h3>
          <p className="text-sm text-muted-foreground">Order completion rates and delivery times</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <span className="text-xs text-muted-foreground">{isLive ? 'Live' : 'Paused'}</span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="flex items-center space-x-2 px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            <Icon name={isLive ? 'Pause' : 'Play'} size={12} />
            <span>{isLive ? 'Pause' : 'Resume'}</span>
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="completionRate"
              stroke="var(--color-success)"
              strokeWidth={2}
              dot={false}
              name="Completion Rate (%)"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="avgDeliveryTime"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              name="Avg Delivery Time (min)"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimeChart;