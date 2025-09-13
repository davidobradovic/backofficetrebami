import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI, ordersAPI } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { AppIcon } from '../../components/AppIcon';

const UserDetail = () => {
  const { userId: idParam } = useParams();
  const id = idParam ? parseInt(idParam, 10) : null;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isNewUser, setIsNewUser] = useState(false);

  // No mock data - rely only on API

  // Calculate user stats from orders data
  const calculateUserStats = (orders) => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageRating: 'N/A',
        completedOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
        totalReviews: 0
      };
    }

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || order.totalPrice || 0), 0);
    
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'in_progress').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
    
    const ordersWithRating = orders.filter(order => order.rating && order.rating > 0);
    const averageRating = ordersWithRating.length > 0 
      ? (ordersWithRating.reduce((sum, order) => sum + order.rating, 0) / ordersWithRating.length).toFixed(1)
      : 'N/A';
    
    const totalReviews = ordersWithRating.length;

    return {
      totalOrders,
      totalSpent,
      averageRating,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalReviews
    };
  };

  useEffect(() => {
    console.log('UserDetail useEffect - id:', id, 'type:', typeof id);
    
    // Check if this is a new user creation (id is 'new' or null)
    if (idParam === 'new' || !idParam) {
      setIsNewUser(true);
      setLoading(false);
      setUser({
        fullName: '',
        email: '',
        phoneNumber: '',
        role: 'user',
        isActive: true,
        address: '',
        city: '',
        country: '',
        postalCode: '',
        dateOfBirth: '',
        gender: '',
        refferal: '',
        usedRefferal: ''
      });
    } else {
      setIsNewUser(false);
      fetchUserData();
    }
  }, [id, idParam]);

  const fetchUserData = async () => {
    if (!id || isNaN(id)) {
      console.error('Invalid user ID provided:', id);
      setUser(null);
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching user with ID:', id);
      
      // Fetch user data and orders in parallel
      const [userResponse, ordersResponse] = await Promise.allSettled([
        usersAPI.getById(id),
        ordersAPI.getAll({ customerId: id })
      ]);
      
      // Handle user data
      if (userResponse.status === 'fulfilled' && userResponse.value && userResponse.value.success && userResponse.value.data) {
        setUser(userResponse.value.data);
      } else {
        console.error('Failed to fetch user data:', userResponse);
        setUser(null);
      }
      
      // Handle orders data
      if (ordersResponse.status === 'fulfilled' && ordersResponse.value && ordersResponse.value.success && ordersResponse.value.data) {
        const orders = ordersResponse.value.data;
        setOrders(orders);
        
        // Calculate stats from orders data
        const stats = calculateUserStats(orders);
        setUserStats(stats);
      } else {
        console.warn('Could not fetch orders:', ordersResponse);
        setOrders([]);
        setUserStats(null);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
      setOrders([]);
      setUserStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = () => {
    setShowEditModal(true);
  };

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleSaveNewUser = async (userData) => {
    try {
      // Validate required fields for new user
      if (!userData.fullName || !userData.email || !userData.password) {
        alert('Ime, email i lozinka su obavezni');
        return;
      }

      // Prepare data for user creation
      const createData = {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        role: userData.role || 'user',
        address: userData.address,
        city: userData.city,
        country: userData.country,
        postalCode: userData.postalCode,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        refferal: userData.refferal,
        usedRefferal: userData.usedRefferal,
        isActive: userData.isActive !== undefined ? userData.isActive : true
      };

      // Remove empty fields
      const cleanData = Object.fromEntries(
        Object.entries(createData).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      console.log('Creating new user with data:', cleanData);

      const response = await usersAPI.create(cleanData);
      if (response && response.success && response.data) {
        setUser(response.data);
        setShowCreateModal(false);
        alert('Korisnik je uspešno kreiran');
        // Navigate to the new user's detail page
        navigate(`/users-management/${response.data.id}`);
      } else {
        console.error('Failed to create user:', response);
        alert('Greška pri kreiranju korisnika');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Greška pri kreiranju korisnika');
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      // Validate required fields
      if (!userData.fullName || !userData.email) {
        alert('Ime i email su obavezni');
        return;
      }
      
      // Filter out fields that shouldn't be sent to backend
      const { profileImage, ...updateData } = userData;
      
      // Only send allowed fields for user update
      const allowedFields = {
        fullName: updateData.fullName,
        email: updateData.email,
        phoneNumber: updateData.phoneNumber,
        address: updateData.address,
        city: updateData.city,
        country: updateData.country,
        postalCode: updateData.postalCode,
        dateOfBirth: updateData.dateOfBirth,
        gender: updateData.gender,
        refferal: updateData.refferal,
        usedRefferal: updateData.usedRefferal
      };
      
      // Remove empty fields
      const cleanData = Object.fromEntries(
        Object.entries(allowedFields).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );
      
      console.log('Sending user update data:', cleanData);
      
      const response = await usersAPI.update(id, cleanData);
      if (response && response.success && response.data) {
        setUser(response.data);
        setShowEditModal(false);
        alert('Korisnik je uspešno ažuriran');
      } else {
        console.error('Failed to update user:', response);
        alert('Greška pri ažuriranju korisnika');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Greška pri ažuriranju korisnika');
    }
  };

  const handleToggleBan = async () => {
    try {
      const response = await usersAPI.toggleBan(id, !user.isActive);
      if (response && response.success && response.data) {
        setUser(response.data);
        alert(user.isActive ? 'Korisnik je deaktiviran' : 'Korisnik je aktiviran');
      } else {
        console.error('Failed to toggle ban:', response);
        alert('Greška pri promeni statusa korisnika');
      }
    } catch (error) {
      console.error('Error toggling ban:', error);
      alert('Greška pri promeni statusa korisnika');
    }
  };

  const handleChangePassword = async () => {
    const newPassword = prompt('Unesite novu lozinku:');
    if (newPassword) {
      try {
        const response = await usersAPI.changePassword(id, { newPassword });
        if (response && response.success) {
          alert('Lozinka je uspešno promenjena');
        } else {
          alert('Greška pri promeni lozinke');
        }
      } catch (error) {
        console.error('Error changing password:', error);
        alert('Greška pri promeni lozinke');
      }
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje podataka o korisniku...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <AppIcon name="UserX" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Korisnik nije pronađen</h3>
        <p className="text-gray-600 mb-4">Korisnik koga tražite ne postoji ili je obrisan.</p>
        <Button
          variant="outline"
          onClick={() => navigate('/users-management')}
          iconName="ArrowLeft"
        >
          Nazad na korisnike
        </Button>
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
            onClick={() => navigate('/users-management')}
            iconName="ArrowLeft"
          >
            Nazad na korisnike
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNewUser ? 'Novi korisnik' : user.fullName}
          </h1>
        </div>
        <div className="flex space-x-3">
          {isNewUser ? (
            <Button onClick={handleCreateUser}>
              Kreiraj korisnika
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleEditUser}>
                Uredi korisnika
              </Button>
              <Button
                variant="outline"
                onClick={handleChangePassword}
                className="text-blue-600 hover:text-blue-700"
              >
                Promeni lozinku
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleBan}
                className={!user.isActive ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}
              >
                {!user.isActive ? 'Aktiviraj korisnika' : 'Deaktiviraj korisnika'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <AppIcon name="User" className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.fullName}
              </h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                !user.isActive 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {!user.isActive ? 'Neaktivan' : 'Aktivan'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-800' 
                  : user.role === 'worker'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.role === 'admin' ? 'Admin' : user.role === 'worker' ? 'Radnik' : 'Korisnik'}
              </span>
            </div>
            <p className="text-gray-600 mb-1">{user.email}</p>
            <p className="text-gray-600 mb-1">{user.phoneNumber}</p>
            <p className="text-gray-600">{user.address || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AppIcon name="ShoppingBag" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ukupno porudžbina</p>
              <p className="text-2xl font-semibold text-gray-900">{userStats?.totalOrders || orders.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <AppIcon name="DollarSign" className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ukupno potrošeno</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(userStats?.totalSpent || userStats?.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AppIcon name="Star" className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prosečna ocena</p>
              <p className="text-2xl font-semibold text-gray-900">{userStats?.averageRating || userStats?.avgRating || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AppIcon name="Clock" className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Poslednja aktivnost</p>
              <p className="text-sm font-semibold text-gray-900">
                {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Additional stats if available */}
        {userStats && (
          <>
            {userStats.completedOrders && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <AppIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Završene porudžbine</p>
                    <p className="text-2xl font-semibold text-gray-900">{userStats.completedOrders}</p>
                  </div>
                </div>
              </div>
            )}

            {userStats.pendingOrders && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AppIcon name="Clock" className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Na čekanju</p>
                    <p className="text-2xl font-semibold text-gray-900">{userStats.pendingOrders}</p>
                  </div>
                </div>
              </div>
            )}

            {userStats.cancelledOrders && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AppIcon name="XCircle" className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Otkazane</p>
                    <p className="text-2xl font-semibold text-gray-900">{userStats.cancelledOrders}</p>
                  </div>
                </div>
              </div>
            )}

            {userStats.totalReviews && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <AppIcon name="MessageSquare" className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ukupno recenzija</p>
                    <p className="text-2xl font-semibold text-gray-900">{userStats.totalReviews}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Pregled', icon: 'User' },
              { id: 'orders', name: 'Porudžbine', icon: 'ShoppingBag' },
              { id: 'activity', name: 'Aktivnost', icon: 'Activity' }
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Lični podaci</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Datum rođenja</label>
                      <p className="text-sm text-gray-900">{user.dateOfBirth ? formatDate(user.dateOfBirth) : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pol</label>
                      <p className="text-sm text-gray-900 capitalize">{user.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Grad</label>
                      <p className="text-sm text-gray-900">{user.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Zemlja</label>
                      <p className="text-sm text-gray-900">{user.country || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Poštanski broj</label>
                      <p className="text-sm text-gray-900">{user.postalCode || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Referal kod</label>
                      <p className="text-sm text-gray-900">{user.refferal || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Koristi referal</label>
                      <p className="text-sm text-gray-900">{user.usedRefferal || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informacije o nalogu</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Član od</label>
                      <p className="text-sm text-gray-900">{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Poslednja aktivnost</label>
                      <p className="text-sm text-gray-900">{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status naloga</label>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          !user.isActive 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {!user.isActive ? 'Neaktivan' : 'Aktivan'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'worker'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : user.role === 'worker' ? 'Radnik' : 'Korisnik'}
                        </span>
                      </div>
                    </div>
                    {user.bannedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Banovan od</label>
                        <p className="text-sm text-gray-900">{formatDateTime(user.bannedAt)}</p>
                      </div>
                    )}
                    {user.banReason && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Razlog banovanja</label>
                        <p className="text-sm text-gray-900">{user.banReason}</p>
                      </div>
                    )}
                    {user.workerId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Worker ID</label>
                        <p className="text-sm text-gray-900">{user.workerId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Omiljene kategorije</h3>
                <div className="flex flex-wrap gap-2">
                  {(userStats?.preferredCategories || user.preferredCategories) && (userStats?.preferredCategories || user.preferredCategories).length > 0 ? (
                    (userStats?.preferredCategories || user.preferredCategories).map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {typeof category === 'string' ? category : category.title || category.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Nema omiljenih kategorija</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Istorija porudžbina</h3>
                <span className="text-sm text-gray-500">{orders.length} porudžbina</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Porudžbina
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Radnik
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategorija
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Iznos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Datum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ocena
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.orderNumber || `#${order.id}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.description || order.title || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.worker ? `${order.worker.firstName || ''} ${order.worker.lastName || ''}`.trim() || order.worker.fullName || 'N/A' : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.category?.title || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(order.totalAmount || order.totalPrice || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.createdAt ? formatDateTime(order.createdAt) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.rating ? (
                              <div className="flex items-center">
                                <AppIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm text-gray-900">{order.rating}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Nema ocene</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          Nema porudžbina
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nedavna aktivnost</h3>
              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.slice(0, 5).map((order, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <AppIcon name="ShoppingBag" className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900">
                          {order.status === 'completed' ? 'Završena porudžbina' : 
                           order.status === 'in_progress' ? 'Porudžbina u toku' : 
                           'Nova porudžbina'} {order.orderNumber || `#${order.id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.createdAt ? formatDateTime(order.createdAt) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AppIcon name="Activity" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nema nedavne aktivnosti</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditUserModal
          user={user}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveUser}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveNewUser}
        />
      )}
    </div>
  );
};

// Edit User Modal Component
const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    profileImage: null,
    address: '',
    city: '',
    country: '',
    postalCode: '',
    dateOfBirth: '',
    gender: '',
    refferal: '',
    usedRefferal: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        profileImage: user.profileImage || null,
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        postalCode: user.postalCode || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        refferal: user.refferal || '',
        usedRefferal: user.usedRefferal || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
            <h2 className="text-xl font-semibold">Uredi korisnika</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <AppIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ime i Prezime *
              </label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
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
                  Telefon *
                </label>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profilna slika
              </label>
              <ImageUpload
                onImageSelect={handleImageUpload}
                currentImage={formData.profileImage}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresa
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grad
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zemlja
                </label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poštanski broj
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
                  Datum rođenja
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
                  Pol
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Izaberite pol</option>
                  <option value="male">Muški</option>
                  <option value="female">Ženski</option>
                  <option value="other">Ostalo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referal kod
                </label>
                <Input
                  name="refferal"
                  value={formData.refferal}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Koristi referal
                </label>
                <Input
                  name="usedRefferal"
                  value={formData.usedRefferal}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Otkaži
              </Button>
              <Button type="submit">
                Ažuriraj korisnika
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Create User Modal Component
const CreateUserModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'user',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    dateOfBirth: '',
    gender: '',
    refferal: '',
    usedRefferal: '',
    isActive: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
            <h2 className="text-xl font-semibold">Kreiraj novog korisnika</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <AppIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ime i Prezime *
              </label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
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
                  Lozinka *
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uloga
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">Korisnik</option>
                  <option value="worker">Radnik</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresa
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grad
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zemlja
                </label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poštanski broj
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
                  Datum rođenja
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
                  Pol
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Izaberite pol</option>
                  <option value="male">Muški</option>
                  <option value="female">Ženski</option>
                  <option value="other">Ostalo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referal kod
                </label>
                <Input
                  name="refferal"
                  value={formData.refferal}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Koristi referal
                </label>
                <Input
                  name="usedRefferal"
                  value={formData.usedRefferal}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Aktivan korisnik
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Otkaži
              </Button>
              <Button type="submit">
                Kreiraj korisnika
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;