import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveOrdersGrid = ({ className = '' }) => {
  const [orders, setOrders] = useState([]);
  const [sortField, setSortField] = useState('estimatedCompletion');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusConfig = {
    'pending': { color: 'text-warning', bgColor: 'bg-warning/10', icon: 'Clock' },
    'assigned': { color: 'text-primary', bgColor: 'bg-primary/10', icon: 'User' },
    'in-progress': { color: 'text-success', bgColor: 'bg-success/10', icon: 'Truck' },
    'delayed': { color: 'text-error', bgColor: 'bg-error/10', icon: 'AlertTriangle' },
    'completed': { color: 'text-muted-foreground', bgColor: 'bg-muted', icon: 'CheckCircle' }
  };

  const mockOrders = [
    {
      id: 'ORD-2024-8901',
      customer: 'John Smith',
      service: 'Home Cleaning',
      worker: 'Maria Garcia',
      status: 'in-progress',
      estimatedCompletion: new Date(Date.now() + 1800000),
      location: 'Downtown District',
      priority: 'high',
      duration: '2h 30m',
      progress: 65
    },
    {
      id: 'ORD-2024-8902',
      customer: 'Sarah Johnson',
      service: 'Plumbing Repair',
      worker: 'Mike Wilson',
      status: 'delayed',
      estimatedCompletion: new Date(Date.now() - 900000),
      location: 'North District',
      priority: 'critical',
      duration: '1h 45m',
      progress: 30
    },
    {
      id: 'ORD-2024-8903',
      customer: 'David Brown',
      service: 'Electrical Work',
      worker: 'Alex Thompson',
      status: 'assigned',
      estimatedCompletion: new Date(Date.now() + 3600000),
      location: 'West District',
      priority: 'medium',
      duration: '3h 15m',
      progress: 0
    },
    {
      id: 'ORD-2024-8904',
      customer: 'Lisa Davis',
      service: 'Garden Maintenance',
      worker: 'Carlos Rodriguez',
      status: 'in-progress',
      estimatedCompletion: new Date(Date.now() + 2700000),
      location: 'South District',
      priority: 'low',
      duration: '4h 00m',
      progress: 45
    },
    {
      id: 'ORD-2024-8905',
      customer: 'Robert Wilson',
      service: 'AC Repair',
      worker: 'Jennifer Lee',
      status: 'pending',
      estimatedCompletion: new Date(Date.now() + 5400000),
      location: 'East District',
      priority: 'high',
      duration: '2h 00m',
      progress: 0
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...orders]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'estimatedCompletion') {
      aValue = aValue?.getTime();
      bValue = bValue?.getTime();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((date - now) / 1000);
    
    if (diff < 0) {
      const absDiff = Math.abs(diff);
      if (absDiff < 3600) return `${Math.floor(absDiff / 60)}m overdue`;
      return `${Math.floor(absDiff / 3600)}h overdue`;
    }
    
    if (diff < 3600) return `${Math.floor(diff / 60)}m remaining`;
    return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m remaining`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const SortHeader = ({ field, children }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <Icon 
            name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
            size={12} 
          />
        )}
      </div>
    </th>
  );

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Active Orders</h3>
            <p className="text-sm text-muted-foreground">{orders?.length} orders in progress</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Filter">
              Filter
            </Button>
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <SortHeader field="id">Order ID</SortHeader>
              <SortHeader field="customer">Customer</SortHeader>
              <SortHeader field="service">Service</SortHeader>
              <SortHeader field="worker">Worker</SortHeader>
              <SortHeader field="status">Status</SortHeader>
              <SortHeader field="estimatedCompletion">ETA</SortHeader>
              <SortHeader field="location">Location</SortHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedOrders?.map((order) => (
              <tr 
                key={order?.id} 
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{order?.id}</span>
                    <span className={`text-xs font-medium uppercase ${getPriorityColor(order?.priority)}`}>
                      {order?.priority}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-foreground">{order?.customer}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-foreground">{order?.service}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-foreground">{order?.worker}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-full text-xs font-medium ${statusConfig?.[order?.status]?.bgColor} ${statusConfig?.[order?.status]?.color}`}>
                    <Icon name={statusConfig?.[order?.status]?.icon} size={12} />
                    <span className="capitalize">{order?.status?.replace('-', ' ')}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className={`font-medium ${
                      order?.estimatedCompletion < new Date() ? 'text-error' : 'text-foreground'
                    }`}>
                      {formatTime(order?.estimatedCompletion)}
                    </div>
                    {order?.status === 'in-progress' && (
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${order?.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-muted-foreground">{order?.location}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="xs" iconName="Eye" />
                    <Button variant="ghost" size="xs" iconName="MessageSquare" />
                    <Button variant="ghost" size="xs" iconName="MoreHorizontal" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Order Details - {selectedOrder?.id}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => setSelectedOrder(null)}
                />
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Customer Information</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder?.customer}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder?.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Service Details</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder?.service}</p>
                  <p className="text-sm text-muted-foreground">Duration: {selectedOrder?.duration}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Worker Information</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder?.worker}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Status</h4>
                  <div className={`inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-full text-xs font-medium ${statusConfig?.[selectedOrder?.status]?.bgColor} ${statusConfig?.[selectedOrder?.status]?.color}`}>
                    <Icon name={statusConfig?.[selectedOrder?.status]?.icon} size={12} />
                    <span className="capitalize">{selectedOrder?.status?.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveOrdersGrid;