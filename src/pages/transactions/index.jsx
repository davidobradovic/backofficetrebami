import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { AppIcon } from '../../components/AppIcon';

const TransactionsManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Fetch transactions from API
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchTerm, statusFilter, paymentMethodFilter, dateRangeFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      
      console.log('Transactions API response:', response);
      
      // Backend returns { success: true, data: rows, pagination: {...} }
      if (response && response.success && response.data) {
        setTransactions(response.data);
        setFilteredTransactions(response.data);
        setTotalPages(response.pagination?.pages || 1);
        setTotalItems(response.pagination?.total || response.data.length);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Show empty state instead of mock data
      setTransactions([]);
      setFilteredTransactions([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filter changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePaymentMethodFilterChange = (value) => {
    setPaymentMethodFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDateRangeFilterChange = (value) => {
    setDateRangeFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filterTransactions = () => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = 
        transaction.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        transaction.status === statusFilter;
      
      const matchesPaymentMethod = paymentMethodFilter === 'all' ||
        transaction.paymentMethod === paymentMethodFilter;

      const matchesDateRange = dateRangeFilter === 'all' ||
        (dateRangeFilter === 'today' && isToday(transaction.createdAt)) ||
        (dateRangeFilter === 'week' && isThisWeek(transaction.createdAt)) ||
        (dateRangeFilter === 'month' && isThisMonth(transaction.createdAt));

      return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDateRange;
    });

    setFilteredTransactions(filtered);
  };

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  const isThisWeek = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo;
  };

  const isThisMonth = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleRefund = (transaction) => {
    setSelectedTransaction(transaction);
    setShowRefundModal(true);
  };

  const handleProcessRefund = async (refundData) => {
    try {
      // Process refund logic here
      console.log('Processing refund:', refundData);
      setShowRefundModal(false);
      setSelectedTransaction(null);
      fetchTransactions(); // Refresh transactions
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('sr-RS');
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-red-100 text-red-800',
      failed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      credit_card: 'CreditCard',
      bank_transfer: 'Building2',
      cash: 'Banknote',
      paypal: 'DollarSign'
    };
    return icons[method] || 'CreditCard';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upravljanje transakcijama</h1>
        <div className="flex space-x-3">
          <Button variant="outline" iconName="Download">
            Izvezi
          </Button>
          <Button variant="outline" iconName="RefreshCw">
            Osveži
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Pretražite transakcije..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            iconName="Search"
          />
          <Select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option value="all">Svi Statusi</option>
            <option value="completed">Završeno</option>
            <option value="pending">Na čekanju</option>
            <option value="refunded">Vraćeno</option>
            <option value="failed">Neuspešno</option>
          </Select>
          <Select
            value={paymentMethodFilter}
            onChange={(e) => handlePaymentMethodFilterChange(e.target.value)}
          >
            <option value="all">Svi načini plaćanja</option>
            <option value="credit_card">Kreditna kartica</option>
            <option value="bank_transfer">Bankovni transfer</option>
            <option value="cash">Gotovina</option>
            <option value="paypal">PayPal</option>
          </Select>
          <Select
            value={dateRangeFilter}
            onChange={(e) => handleDateRangeFilterChange(e.target.value)}
          >
            <option value="all">Sve vreme</option>
            <option value="today">Danas</option>
            <option value="week">Ova nedelja</option>
            <option value="month">Ovaj mesec</option>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <AppIcon name="TrendingUp" className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ukupan prihod</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(
                  transactions
                    .filter(t => t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0),
                  'RSD'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AppIcon name="CreditCard" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ukupno transakcija</p>
              <p className="text-2xl font-semibold text-gray-900">
                {transactions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AppIcon name="Clock" className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {transactions.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AppIcon name="RefreshCw" className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vraćeno</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(
                  transactions
                    .filter(t => t.status === 'refunded')
                    .reduce((sum, t) => sum + t.refundAmount, 0),
                  'RSD'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kupac
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Radnik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Iznos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {transaction.customerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {transaction.workerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                    {transaction.refundAmount > 0 && (
                      <div className="text-sm text-red-600">
                        Vraćeno: {formatCurrency(transaction.refundAmount, transaction.currency)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <AppIcon 
                        name={getPaymentMethodIcon(transaction.paymentMethod)} 
                        className="w-4 h-4 text-gray-400 mr-2" 
                      />
                      <span className="text-sm text-gray-900 capitalize">
                        {transaction.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(transaction.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        View
                      </Button>
                      {transaction.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRefund(transaction)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Vrati
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTransactions.length === 0 && !loading && (
        <div className="text-center py-12">
          <AppIcon name="CreditCard" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nema pronađenih transakcija</h3>
          <p className="text-gray-600">Pokušajte da prilagodite kriterijume pretrage ili filtriranja.</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <RefundModal
          transaction={selectedTransaction}
          isOpen={showRefundModal}
          onClose={() => setShowRefundModal(false)}
          onRefund={handleProcessRefund}
        />
      )}
    </div>
  );
};

// Transaction Detail Modal Component
const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Transaction Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <AppIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID transakcije
                </label>
                <p className="text-sm text-gray-900">{transaction.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Broj narudžbe
                </label>
                <p className="text-sm text-gray-900">{transaction.orderNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kupac
                </label>
                <p className="text-sm text-gray-900">{transaction.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Radnik
                </label>
                <p className="text-sm text-gray-900">{transaction.workerName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Iznos
                </label>
                <p className="text-sm text-gray-900">
                  {new Intl.NumberFormat('sr-RS', {
                    style: 'currency',
                    currency: transaction.currency
                  }).format(transaction.amount)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <p className="text-sm text-gray-900 capitalize">
                  {transaction.paymentMethod.replace('_', ' ')}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opis
              </label>
              <p className="text-sm text-gray-900">{transaction.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kreiran
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(transaction.createdAt).toLocaleString('sr-RS')}
                </p>
              </div>
              {transaction.completedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Završen
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(transaction.completedAt).toLocaleString('sr-RS')}
                  </p>
                </div>
              )}
            </div>

            {transaction.refundAmount > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-red-800 mb-2">Informacije o povraćaju</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">
                      Iznos povraćaja
                    </label>
                    <p className="text-sm text-red-900">
                      {new Intl.NumberFormat('sr-RS', {
                        style: 'currency',
                        currency: transaction.currency
                      }).format(transaction.refundAmount)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">
                      Datum povraćaja
                    </label>
                    <p className="text-sm text-red-900">
                      {new Date(transaction.refundedAt).toLocaleString('sr-RS')}
                    </p>
                  </div>
                </div>
                {transaction.refundReason && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-red-700 mb-1">
                      Razlog povraćaja
                    </label>
                    <p className="text-sm text-red-900">{transaction.refundReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Refund Modal Component
const RefundModal = ({ transaction, isOpen, onClose, onRefund }) => {
  const [formData, setFormData] = useState({
    refundAmount: 0,
    refundReason: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        refundAmount: transaction.amount,
        refundReason: ''
      });
    }
  }, [transaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRefund(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Obrađi povraćaj</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <AppIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Originalni iznos
              </label>
              <p className="text-sm text-gray-900">
                {new Intl.NumberFormat('sr-RS', {
                  style: 'currency',
                  currency: transaction.currency
                }).format(transaction.amount)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Iznos povraćaja *
              </label>
              <Input
                type="number"
                name="refundAmount"
                value={formData.refundAmount}
                onChange={handleInputChange}
                min="0"
                max={transaction.amount}
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razlog povraćaja *
              </label>
              <textarea
                name="refundReason"
                value={formData.refundReason}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter reason for refund..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Otkaži
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                Obrađi povraćaj
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionsManagement;