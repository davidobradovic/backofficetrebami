import React, { useState, useEffect } from 'react';
import { workersAPI } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Pagination } from '../../components/ui/Pagination';
import { AppIcon } from '../../components/AppIcon';

const WorkersManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Fetch workers from API
  useEffect(() => {
    fetchWorkers();
  }, [currentPage, searchTerm, statusFilter, verificationFilter]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await workersAPI.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        verified: verificationFilter !== 'all' ? (verificationFilter === 'verified' ? 'true' : 'false') : undefined
      });
      
      console.log('Workers API response:', response);
      
      // Backend returns { success: true, data: rows, pagination: {...} }
      if (response && response.success && response.data) {
        setWorkers(response.data);
        setFilteredWorkers(response.data);
        setTotalPages(response.pagination?.pages || 1);
        setTotalItems(response.pagination?.total || response.data.length);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
      // Show empty state instead of mock data
      setWorkers([]);
      setFilteredWorkers([]);
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

  const handleVerificationFilterChange = (value) => {
    setVerificationFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filterWorkers = () => {
    let filtered = workers.filter(worker => {
      const matchesSearch = 
        worker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'available' && worker.isAvailable) ||
        (statusFilter === 'unavailable' && !worker.isAvailable);
      
      const matchesVerification = verificationFilter === 'all' ||
        (verificationFilter === 'verified' && worker.isVerified) ||
        (verificationFilter === 'unverified' && !worker.isVerified);

      return matchesSearch && matchesStatus && matchesVerification;
    });
    
    setFilteredWorkers(filtered);
  };

  const handleCreateWorker = () => {
    setEditingWorker(null);
    setShowCreateModal(true);
  };

  const handleEditWorker = (worker) => {
    setEditingWorker(worker);
    setShowEditModal(true);
  };

  const handleSaveWorker = async (workerData) => {
    try {
      if (editingWorker) {
        // Update existing worker
        const response = await workersAPI.update(editingWorker.id, workerData);
        setWorkers(workers.map(w => w.id === editingWorker.id ? response.data : w));
        setShowEditModal(false);
      } else {
        // Create new worker
        const response = await workersAPI.create(workerData);
        setWorkers([...workers, response.data]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error saving worker:', error);
    }
  };

  const handleDeleteWorker = async (workerId) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await workersAPI.delete(workerId);
        setWorkers(workers.filter(w => w.id !== workerId));
      } catch (error) {
        console.error('Error deleting worker:', error);
      }
    }
  };

  const handleToggleAvailability = async (workerId) => {
    try {
      const worker = workers.find(w => w.id === workerId);
      const response = await workersAPI.toggleAvailability(workerId, !worker.isAvailable);
      setWorkers(workers.map(w => w.id === workerId ? response.data : w));
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const handleToggleVerification = async (workerId) => {
    try {
      const worker = workers.find(w => w.id === workerId);
      const response = await workersAPI.toggleVerification(workerId, !worker.isVerified);
      setWorkers(workers.map(w => w.id === workerId ? response.data : w));
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

    return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upravljanje radnicima</h1>
        <Button onClick={handleCreateWorker} iconName="Plus">
          Dodaj novog radnika
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
            placeholder="Search workers..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            iconName="Search"
          />
                      <Select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option value="all">Svi Statusi</option>
            <option value="available">Dostupan</option>
            <option value="unavailable">Nedostupan</option>
          </Select>
          <Select
            value={verificationFilter}
            onChange={(e) => handleVerificationFilterChange(e.target.value)}
          >
            <option value="all">Sve Verifikacije</option>
            <option value="verified">Verifikovan</option>
            <option value="unverified">Nije verifikovan</option>
            </Select>
        </div>
        </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <div key={worker.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {worker.profileImage ? (
                    <img
                      src={worker.profileImage}
                      alt={worker.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <AppIcon name="User" className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {worker.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">{worker.email}</p>
                  <p className="text-sm text-gray-600">{worker.phone}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    worker.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {worker.isAvailable ? 'Dostupan' : 'Nedostupan'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verifikovan:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    worker.isVerified 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {worker.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating:</span>
                  <div className="flex items-center">
                    <AppIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{worker.rating}</span>
            </div>
          </div>
            <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed Jobs:</span>
                  <span className="text-sm font-medium">{worker.completedJobs}</span>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-sm text-gray-600">Specialties:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {worker.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {specialty}
                    </span>
                  ))}
            </div>
          </div>

              <div className="mb-4">
                <span className="text-sm text-gray-600">Location:</span>
                <p className="text-sm text-gray-900 mt-1">{worker.location.address}</p>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>Joined: {formatDate(worker.createdAt)}</p>
                <p>Last Active: {formatDateTime(worker.lastActive)}</p>
          </div>
        </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
              <div className="flex space-x-2">
                        <Button
                          size="sm"
                  variant="outline"
                  onClick={() => handleToggleAvailability(worker.id)}
                        >
                  {worker.isAvailable ? 'Označi kao nedostupan' : 'Označi kao dostupan'}
                        </Button>
                        <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleVerification(worker.id)}
                >
                  {worker.isVerified ? 'Unverify' : 'Verify'}
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                          size="sm"
                  variant="outline"
                          onClick={() => handleEditWorker(worker)}
                        >
                  Uredi
                        </Button>
                        <Button
                          size="sm"
                  variant="outline"
                          onClick={() => handleDeleteWorker(worker.id)}
                  className="text-red-600 hover:text-red-700"
                        >
                  Obriši
                        </Button>
                      </div>
            </div>
          </div>
        ))}
        </div>

      {filteredWorkers.length === 0 && !loading && (
        <div className="text-center py-12">
          <AppIcon name="Users" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nema pronađenih radnika</h3>
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

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <WorkerModal
          worker={editingWorker}
          isOpen={showCreateModal || showEditModal}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setEditingWorker(null);
          }}
          onSave={handleSaveWorker}
          isEdit={showEditModal}
        />
      )}
    </div>
  );
};

// Worker Modal Component
const WorkerModal = ({ worker, isOpen, onClose, onSave, isEdit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    categoryId: '',
    subcategoryId: '',
    hourlyRate: '',
    city: '',
    address: '',
    coordinates: [0, 0],
    profileImage: null,
    skills: [],
    description: '',
    experience: 0
  });

  useEffect(() => {
    if (worker) {
      setFormData({
        fullName: worker.fullName || '',
        email: worker.email || '',
        phoneNumber: worker.phoneNumber || '',
        categoryId: worker.categoryId || '',
        subcategoryId: worker.subcategoryId || '',
        hourlyRate: worker.hourlyRate || '',
        city: worker.location?.city || '',
        address: worker.location?.address || '',
        coordinates: worker.location?.coordinates || [0, 0],
        profileImage: worker.profileImage || null,
        skills: worker.skills || [],
        description: worker.description || '',
        experience: worker.experience || 0
      });
    }
  }, [worker]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'skills') {
      // Parse skills from comma-separated string to array
      const skillsArray = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
      setFormData(prev => ({
        ...prev,
        [name]: skillsArray
      }));
    } else if (name === 'categoryId' || name === 'subcategoryId' || name === 'hourlyRate' || name === 'experience') {
      // Parse numeric fields
      setFormData(prev => ({
        ...prev,
        [name]: value ? Number(value) : ''
      }));
    } else if (name === 'coordinates') {
      // Handle coordinates as array
      const coords = value.split(',').map(c => parseFloat(c.trim())).filter(c => !isNaN(c));
      setFormData(prev => ({
        ...prev,
        [name]: coords.length === 2 ? coords : [0, 0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    // Transform form data to match backend expectations
    const workerData = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      categoryId: Number(formData.categoryId),
      subcategoryId: Number(formData.subcategoryId),
      hourlyRate: Number(formData.hourlyRate),
      location: {
        type: 'Point',
        coordinates: formData.coordinates,
        address: formData.address,
        city: formData.city,
        postalCode: ''
      },
      skills: formData.skills,
      description: formData.description,
      experience: Number(formData.experience),
      isAvailable: true,
      isVerified: false,
      ratings: 0,
      reviews: 0,
      totalJobs: 0,
      completedJobs: 0,
      certifications: [],
      workingHours: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '09:00', end: '17:00', available: false },
        sunday: { start: '09:00', end: '17:00', available: false }
      }
    };
    
    onSave(workerData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isEdit ? 'Uredi radnika' : 'Dodaj novog radnika'}
            </h2>
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
                  Ime i Prezime *
                </label>
                <Input
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon *
                </label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specijalnosti *
                </label>
                <Input
                  name="skills"
                  value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorija *
                </label>
                <Input
                  name="categoryId"
                  type="number"
                  value={formData.categoryId || ''}
                  onChange={handleInputChange}
                  placeholder="Unesite ID kategorije"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potkategorija *
                </label>
                <Input
                  name="subcategoryId"
                  type="number"
                  value={formData.subcategoryId || ''}
                  onChange={handleInputChange}
                  placeholder="Unesite ID potkategorije"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satnica (RSD) *
                </label>
                <Input
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate || ''}
                  onChange={handleInputChange}
                  placeholder="Unesite satnicu"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grad *
                </label>
                <Input
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  placeholder="Unesite grad"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresa
              </label>
              <Input
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                placeholder="Unesite adresu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Koordinate (lat, lng)
              </label>
                <Input
                  name="coordinates"
                  value={Array.isArray(formData.coordinates) ? formData.coordinates.join(', ') : '0, 0'}
                  onChange={handleInputChange}
                  placeholder="44.7866, 20.4489"
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Otkaži
              </Button>
              <Button type="submit">
                {isEdit ? 'Ažuriraj radnika' : 'Kreiraj radnika'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkersManagement;