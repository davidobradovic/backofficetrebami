import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertFeed = ({ className = '' }) => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');

  const alertTypes = {
    critical: { color: 'text-error', bgColor: 'bg-error/10', icon: 'AlertTriangle' },
    warning: { color: 'text-warning', bgColor: 'bg-warning/10', icon: 'AlertCircle' },
    info: { color: 'text-primary', bgColor: 'bg-primary/10', icon: 'Info' }
  };

  const mockAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'High Order Delay Rate',
      message: 'Order #ORD-2024-8901 delayed by 45 minutes in Downtown area',
      timestamp: new Date(Date.now() - 300000),
      actionable: true,
      pinned: true
    },
    {
      id: 2,
      type: 'warning',
      title: 'Worker Availability Low',
      message: '3 workers offline in North District, affecting service capacity',
      timestamp: new Date(Date.now() - 600000),
      actionable: true,
      pinned: false
    },
    {
      id: 3,
      type: 'critical',
      title: 'System Performance Alert',
      message: 'API response time increased to 2.3s, investigating root cause',
      timestamp: new Date(Date.now() - 900000),
      actionable: false,
      pinned: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Peak Hour Started',
      message: 'Lunch rush period initiated, scaling worker assignments',
      timestamp: new Date(Date.now() - 1200000),
      actionable: false,
      pinned: false
    },
    {
      id: 5,
      type: 'warning',
      title: 'Payment Gateway Latency',
      message: 'Stripe payment processing showing 15% slower response times',
      timestamp: new Date(Date.now() - 1800000),
      actionable: true,
      pinned: false
    },
    {
      id: 6,
      type: 'info',
      title: 'New Worker Onboarded',
      message: 'Sarah Johnson completed onboarding in West District',
      timestamp: new Date(Date.now() - 2400000),
      actionable: false,
      pinned: false
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
  }, []);

  const filteredAlerts = alerts?.filter(alert => 
    filter === 'all' || alert?.type === filter
  )?.sort((a, b) => {
    if (a?.pinned && !b?.pinned) return -1;
    if (!a?.pinned && b?.pinned) return 1;
    return b?.timestamp - a?.timestamp;
  });

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const handleAction = (alertId, action) => {
    console.log(`Action ${action} for alert ${alertId}`);
    // Mock action handling
  };

  const togglePin = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, pinned: !alert?.pinned } : alert
    ));
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">System Alerts</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {['all', 'critical', 'warning', 'info']?.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors capitalize ${
                filter === type 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No alerts for selected filter</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredAlerts?.map((alert) => (
              <div
                key={alert?.id}
                className={`p-4 border-l-4 hover:bg-accent/50 transition-colors ${
                  alert?.type === 'critical' ? 'border-l-error' :
                  alert?.type === 'warning'? 'border-l-warning' : 'border-l-primary'
                } ${alert?.pinned ? 'bg-accent/20' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-1.5 rounded-full ${alertTypes?.[alert?.type]?.bgColor}`}>
                      <Icon 
                        name={alertTypes?.[alert?.type]?.icon} 
                        size={14} 
                        className={alertTypes?.[alert?.type]?.color} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-card-foreground truncate">
                          {alert?.title}
                        </h4>
                        {alert?.pinned && (
                          <Icon name="Pin" size={12} className="text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {alert?.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(alert?.timestamp)}
                        </span>
                        {alert?.actionable && (
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleAction(alert?.id, 'resolve')}
                            >
                              Resolve
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleAction(alert?.id, 'investigate')}
                            >
                              Investigate
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePin(alert?.id)}
                    className="ml-2 p-1 hover:bg-accent rounded transition-colors flex-shrink-0"
                  >
                    <Icon 
                      name={alert?.pinned ? 'PinOff' : 'Pin'} 
                      size={12} 
                      className="text-muted-foreground" 
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertFeed;