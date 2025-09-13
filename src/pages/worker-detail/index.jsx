import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workersAPI, ordersAPI } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { AppIcon } from '../../components/AppIcon';

const WorkerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for development
  const mockWorker = {
    id: parseInt(id),
    firstName: 'Marko',
    lastName: 'Petrović',
    email: 'marko.petrovic@email.com',
    phone: '+381 64 123 4567',
    profileImage: null,
    isAvailable: true,
    isVerified: true,
    rating: 4.8,
    completedJobs: 156,
    specialties: ['Plumbing', 'Electrical'],
    location: {
      address: 'Knez Mihailova 15, Belgrade',
      coordinates: { lat: 44.8178, lng: 20.4565 }
    },
    city: 'Belgrade',
    country: 'Serbia',
    postalCode: '11000',
    dateOfBirth: '1980-05-20',
    gender: 'male',
    experience: '5 years',
    hourlyRate: 25.00,
    createdAt: '2024-01-15T10:30:00Z',
    lastActive: '2024-01-20T14:22:00Z',
    totalEarnings: 12500.00,
    averageRating: 4.8,
    responseTime: '2 hours',
    completionRate: 98.5
  };

  const mockOrders = [
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      customerName: 'Ana Nikolić',
      category: 'Plumbing',
      description: 'Fix leaking faucet in kitchen',
      status: 'completed',
      totalAmount: 150.00,
      createdAt: '2024-01-20T14:30:00Z',
      completedAt: '2024-01-20T16:45:00Z',
      rating: 5,
      customerReview: 'Excellent work, very professional!'
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      customerName: 'Stefan Jovanović',
      category: 'Electrical',
      description: 'Install new light fixtures',
      status: 'in_progress',
      totalAmount: 200.00,
      createdAt: '2024-01-19T10:15:00Z',
      completedAt: null,
      rating: null,
      customerReview: null
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-003',
      customerName: 'Milica Stojanović',
      category: 'Plumbing',
      description: 'Repair bathroom sink',
      status: 'completed',
      totalAmount: 120.00,
      createdAt: '2024-01-18T09:30:00Z',
      completedAt: '2024-01-18T12:15:00Z',
      rating: 4,
      customerReview: 'Good work, arrived on time.'
    }
  ];

  useEffect(() => {
    fetchWorkerData();
  }, [id]);

  const fetchWorkerData = async () => {
    setLoading(true);
    try {
      const [workerResponse, ordersResponse] = await Promise.all([
        workersAPI.getById(id),
        ordersAPI.getByWorker(id)
      ]);
      
      setWorker(workerResponse.data || mockWorker);
      setOrders(ordersResponse.data || mockOrders);
    } catch (error) {
      console.error('Error fetching worker data:', error);
      setWorker(mockWorker);
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleEditWorker = () => {
    setShowEditModal(true);
  };

  const handleSaveWorker = async (workerData) => {
    try {
      const response = await workersAPI.update(id, workerData);
      setWorker(response.data);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating worker:', error);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const response = await workersAPI.toggleAvailability(id, !worker.isAvailable);
      setWorker(response.data);
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const handleToggleVerification = async () => {
    try {
      const response = await workersAPI.toggleVerification(id, !worker.isVerified);
      setWorker(response.data);
    } catch (error) {
      console.error('Error toggling verification:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sr-RS');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('sr-RS');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency: 'RSD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="text-center py-12">
        <AppIcon name="UserX" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Worker not found</h3>
        <p className="text-gray-600">The worker you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/workers-management')}
            iconName="ArrowLeft"
          >
            Back to Workers
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {worker.firstName} {worker.lastName}
          </h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleEditWorker}>
            Edit Worker
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleAvailability}
            className={worker.isAvailable ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
          >
            {worker.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleVerification}
            className={worker.isVerified ? 'text-yellow-600 hover:text-yellow-700' : 'text-blue-600 hover:text-blue-700'}
          >
            {worker.isVerified ? 'Unverify' : 'Verify'}
          </Button>
        </div>
      </div>

      {/* Worker Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            {worker.profileImage ? (
              <img
                src={worker.profileImage}
                alt={`${worker.firstName} ${worker.lastName}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <AppIcon name="User" className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {worker.firstName} {worker.lastName}
              </h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                worker.isAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {worker.isAvailable ? 'Available' : 'Unavailable'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                worker.isVerified 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {worker.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <p className="text-gray-600 mb-1">{worker.email}</p>
            <p className="text-gray-600 mb-1">{worker.phone}</p>
            <p className="text-gray-600">{worker.location.address}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <AppIcon name="DollarSign" className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(worker.totalEarnings)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AppIcon name="CheckCircle" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
              <p className="text-2xl font-semibold text-gray-900">{worker.completedJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AppIcon name="Star" className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{worker.averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AppIcon name="Clock" className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-sm font-semibold text-gray-900">{worker.responseTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: 'User' },
              { id: 'orders', name: 'Orders', icon: 'ShoppingBag' },
              { id: 'reviews', name: 'Reviews', icon: 'Star' },
              { id: 'activity', name: 'Activity', icon: 'Activity' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AppIcon name={tab.icon} className="w-4 h-4" />
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <p className="text-sm text-gray-900">{formatDate(worker.dateOfBirth)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <p className="text-sm text-gray-900 capitalize">{worker.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <p className="text-sm text-gray-900">{worker.experience}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                      <p className="text-sm text-gray-900">{formatCurrency(worker.hourlyRate)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Completion Rate</label>
                      <p className="text-sm text-gray-900">{worker.completionRate}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Response Time</label>
                      <p className="text-sm text-gray-900">{worker.responseTime}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Member Since</label>
                      <p className="text-sm text-gray-900">{formatDate(worker.createdAt)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Active</label>
                      <p className="text-sm text-gray-900">{formatDateTime(worker.lastActive)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Order History</h3>
                <span className="text-sm text-gray-500">{orders.length} orders</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.orderNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.rating ? (
                            <div className="flex items-center">
                              <AppIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm text-gray-900">{order.rating}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No rating</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {orders
                  .filter(order => order.rating && order.customerReview)
                  .map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{order.customerName}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <AppIcon
                                key={i}
                                name="Star"
                                className={`w-4 h-4 ${
                                  i < order.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDateTime(order.completedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{order.customerReview}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <AppIcon name="CheckCircle" className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">Completed order ORD-2024-001</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <AppIcon name="Star" className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">Received 5-star rating</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <AppIcon name="User" className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">Account verified</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditWorkerModal
          worker={worker}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveWorker}
        />
      )}
    </div>
  );
};

// Edit Worker Modal Component
const EditWorkerModal = ({ worker, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: null,
    specialties: [],
    location: {
      address: '',
      coordinates: { lat: 0, lng: 0 }
    },
    city: '',
    country: '',
    postalCode: '',
    dateOfBirth: '',
    gender: '',
    experience: '',
    hourlyRate: 0
  });

  useEffect(() => {
    if (worker) {
      setFormData({
        firstName: worker.firstName || '',
        lastName: worker.lastName || '',
        email: worker.email || '',
        phone: worker.phone || '',
        profileImage: worker.profileImage || null,
        specialties: worker.specialties || [],
        location: worker.location || { address: '', coordinates: { lat: 0, lng: 0 } },
        city: worker.city || '',
        country: worker.country || '',
        postalCode: worker.postalCode || '',
        dateOfBirth: worker.dateOfBirth || '',
        gender: worker.gender || '',
        experience: worker.experience || '',
        hourlyRate: worker.hourlyRate || 0
      });
    }
  }, [worker]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleSpecialtyAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newSpecialty = e.target.value.trim();
      if (!formData.specialties.includes(newSpecialty)) {
        setFormData(prev => ({
          ...prev,
          specialties: [...prev.specialties, newSpecialty]
        }));
        e.target.value = '';
      }
    }
  };

  const handleSpecialtyRemove = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleImageUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      profileImage: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Edit Worker</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <AppIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <ImageUpload
                onImageSelect={handleImageUpload}
                currentImage={formData.profileImage}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </label>
              <Input
                placeholder="Type specialty and press Enter to add"
                onKeyPress={handleSpecialtyAdd}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => handleSpecialtyRemove(specialty)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <AppIcon name="X" className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <Input
                name="address"
                value={formData.location.address}
                onChange={handleLocationChange}
                placeholder="Enter worker's address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <Input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                <Input
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (RSD)
                </label>
                <Input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Update Worker
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetail;