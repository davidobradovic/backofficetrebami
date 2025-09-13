import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppIcon } from '../../components/AppIcon';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { usersAPI } from '../../utils/api';

const UsersManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        isActive: statusFilter !== 'all' ? (statusFilter === 'active' ? 'true' : 'false') : undefined
      });
      
      // Backend returns { success: true, data: rows, pagination: {...} }
      if (response && response.success && response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
        setTotalPages(response.pagination?.pages || 1);
        setTotalItems(response.pagination?.total || response.data.length);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Show empty state instead of mock data
      setUsers([]);
      setFilteredUsers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };



  const handleSaveUser = async (userData) => {
    try {
      if (userData.id) {
        // Update existing user
        await usersAPI.update(userData.id, userData);
        setUsers(users.map(user => 
          user.id === userData.id ? userData : user
        ));
      } else {
        // Create new user
        const newUser = await usersAPI.create(userData);
        console.log('Created user:', newUser);
        // Refresh the users list to get the latest data from server
        await fetchUsers();
      }
      
      setShowCreateModal(false);
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Greška pri čuvanju korisnika: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
      try {
        await usersAPI.delete(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Greška pri brisanju korisnika: ' + error.message);
      }
    }
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
          Aktivan
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          Neaktivan
        </span>
      );
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      user: 'bg-blue-100 text-blue-800',
      worker: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800'
    };
    
    const roleLabels = {
      user: 'Korisnik',
      worker: 'Radnik',
      admin: 'Admin'
    };
    
    if (!role) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          N/A
        </span>
      );
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleConfig[role] || 'bg-gray-100 text-gray-800'}`}>
        {roleLabels[role] || role}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upravljanje Korisnicima</h1>
          <p className="text-muted-foreground">Upravljajte svim korisnicima, kupcima i radnicima u sistemu</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Pretražite korisnike po imenu ili email-u..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              iconName="Search"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="all">Svi Statusi</option>
            <option value="active">Aktivan</option>
            <option value="inactive">Neaktivan</option>
            <option value="suspended">Suspendovan</option>
            <option value="pending">Na čekanju</option>
          </Select>
                      <Button onClick={() => navigate('/users-management/new')} iconName="Plus" className="w-full sm:w-auto">
              Dodaj Novog Korisnika
            </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ukupno Korisnika</p>
                <p className="text-2xl font-bold text-foreground">{filteredUsers.length}</p>
              </div>
              <AppIcon name="Users" size={24} className="text-primary" />
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktivni Korisnici</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
              <AppIcon name="UserCheck" size={24} className="text-success" />
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Radnici</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.role === 'worker').length}
                </p>
              </div>
              <AppIcon name="Wrench" size={24} className="text-warning" />
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kupci</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.role === 'user').length}
                </p>
              </div>
              <AppIcon name="ShoppingCart" size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                     Korisnik
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                     Kontakt
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                     Uloga
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                     Pridružio se
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                     Poslednja Prijava
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                     Akcije
                   </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <AppIcon name="User" size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{user.fullName}</div>
                          <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{user.email}</div>
                      <div className="text-sm text-muted-foreground">{user.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/users-management/${user.id}`)}
                          iconName="Eye"
                        >
                          Detalji
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          iconName="Edit"
                        >
                          Izmeni
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          iconName="Trash2"
                          className="text-destructive hover:text-destructive"
                        >
                          Obriši
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Create/Edit User Modal */}
      {(showCreateModal || showEditModal) && (
        <UserModal
          user={editingUser}
          isOpen={showCreateModal || showEditModal}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
          isEdit={showEditModal}
        />
      )}
    </div>
  );
};

// User Modal Component
const UserModal = ({ user, isOpen, onClose, onSave, isEdit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'user',
    password: '',
    isActive: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      ...formData
    };
    
    // Only include id and timestamps for existing users
    if (user?.id) {
      userData.id = user.id;
      userData.createdAt = user.createdAt;
      userData.lastLogin = user.lastLogin;
    }
    
    onSave(userData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {isEdit ? 'Uredi Korisnika' : 'Kreiraj Novog Korisnika'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} iconName="X" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ime i Prezime
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Unesite ime i prezime"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="unesite@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Telefon
              </label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+381 60 123 4567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Uloga
              </label>
              <Select
                value={formData.role}
                onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                options={[
                  { value: 'user', label: 'Korisnik' },
                  { value: 'worker', label: 'Radnik' },
                  { value: 'admin', label: 'Admin' }
                ]}
                placeholder="Izaberite ulogu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Lozinka
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Unesite lozinku (min 6 karaktera)"
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={onClose}>
                Otkaži
              </Button>
              <Button type="submit">
                {isEdit ? 'Sačuvaj Promene' : 'Kreiraj Korisnika'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
