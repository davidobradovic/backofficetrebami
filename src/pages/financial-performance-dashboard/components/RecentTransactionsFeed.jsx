import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactionsFeed = ({ transactions }) => {
  const [filter, setFilter] = useState('all');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(value);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return time?.toLocaleDateString();
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'text-success',
          bg: 'bg-success/10',
          icon: 'CheckCircle'
        };
      case 'pending':
        return {
          color: 'text-warning',
          bg: 'bg-warning/10',
          icon: 'Clock'
        };
      case 'failed':
        return {
          color: 'text-destructive',
          bg: 'bg-destructive/10',
          icon: 'XCircle'
        };
      case 'refunded':
        return {
          color: 'text-muted-foreground',
          bg: 'bg-muted',
          icon: 'RotateCcw'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bg: 'bg-muted',
          icon: 'Circle'
        };
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit card':
        return 'CreditCard';
      case 'paypal':
        return 'Wallet';
      case 'bank transfer':
        return 'Building2';
      case 'digital wallet':
        return 'Smartphone';
      default:
        return 'DollarSign';
    }
  };

  const filteredTransactions = transactions?.filter(transaction => {
    if (filter === 'all') return true;
    return transaction?.status === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'All', count: transactions?.length },
    { value: 'completed', label: 'Completed', count: transactions?.filter(t => t?.status === 'completed')?.length },
    { value: 'pending', label: 'Pending', count: transactions?.filter(t => t?.status === 'pending')?.length },
    { value: 'failed', label: 'Failed', count: transactions?.filter(t => t?.status === 'failed')?.length }
  ];

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground">Latest payment activities</p>
        </div>
        <Button variant="ghost" size="sm" iconName="RefreshCw">
          Refresh
        </Button>
      </div>
      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 p-1 bg-muted rounded-lg">
        {filterOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => setFilter(option?.value)}
            className={`
              flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all
              ${filter === option?.value 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {option?.label}
            <span className="ml-1 text-xs opacity-60">({option?.count})</span>
          </button>
        ))}
      </div>
      {/* Transactions List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTransactions?.map((transaction) => {
          const statusConfig = getStatusConfig(transaction?.status);
          
          return (
            <div key={transaction?.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusConfig?.bg}`}>
                <Icon name={statusConfig?.icon} size={14} className={statusConfig?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {transaction?.description}
                  </p>
                  <span className={`text-sm font-semibold ${transaction?.amount >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {transaction?.amount >= 0 ? '+' : ''}{formatCurrency(transaction?.amount)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Icon name={getPaymentMethodIcon(transaction?.paymentMethod)} size={12} />
                    <span>{transaction?.paymentMethod}</span>
                    <span>•</span>
                    <span>ID: {transaction?.transactionId}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(transaction?.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredTransactions?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Receipt" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No transactions found</p>
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="outline" size="sm" fullWidth iconName="ExternalLink">
          View All Transactions
        </Button>
      </div>
    </div>
  );
};

export default RecentTransactionsFeed;