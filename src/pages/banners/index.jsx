import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import ImageUpload from '../../components/ui/ImageUpload';
import { advertisementsAPI, uploadAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const Banners = () => {
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // Mock banners data
  const mockBanners = [
    {
      id: 1,
      title: 'Glavni Banner - Popravka Aparata',
      description: 'Specijalne ponude za popravku kućnih aparata',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
      status: 'active',
      position: 'homepage-top',
      startDate: '2024-08-01',
      endDate: '2024-12-31',
      priority: 1,
      targetUrl: '/services/appliances',
      clicks: 1247,
      impressions: 15680,
      createdAt: '2024-08-01T10:00:00Z'
    },
    {
      id: 2,
      title: 'Banner za Čišćenje',
      description: 'Profesionalno čišćenje kuća i stanova',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
      status: 'active',
      position: 'homepage-sidebar',
      startDate: '2024-08-15',
      endDate: '2024-11-30',
      priority: 2,
      targetUrl: '/services/cleaning',
      clicks: 892,
      impressions: 12450,
      createdAt: '2024-08-15T14:30:00Z'
    },
    {
      id: 3,
      title: 'Banner za Električne Instalacije',
      description: 'Licencirani električari za sve vrste instalacija',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
      status: 'inactive',
      position: 'services-page',
      startDate: '2024-09-01',
      endDate: '2024-12-31',
      priority: 3,
      targetUrl: '/services/electrical',
      clicks: 0,
      impressions: 0,
      createdAt: '2024-08-20T09:15:00Z'
    }
  ];

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const data = await advertisementsAPI.getAll();
      // Convert HTTP URLs to HTTPS for security
      const bannersWithHttps = data.map(banner => ({
        ...banner,
        imageUrl: banner.imageUrl && banner.imageUrl.startsWith('http://') 
          ? banner.imageUrl.replace('http://', 'https://') 
          : banner.imageUrl
      }));
      setBanners(bannersWithHttps);
      setFilteredBanners(bannersWithHttps);
    } catch (error) {
      console.error('Error fetching banners:', error);
      // Fallback to mock data if API fails
      setBanners(mockBanners);
      setFilteredBanners(mockBanners);
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
    let filtered = banners;
    
    if (searchTerm) {
      filtered = filtered.filter(banner => 
        banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(banner => banner.status === statusFilter);
    }
    
    setFilteredBanners(filtered);
  }, [searchTerm, statusFilter, banners]);

  const handleCreateBanner = () => {
    setEditingBanner(null);
    setShowCreateModal(true);
    
    // Reset form data for new banner
    setFormData({
      title: '',
      description: '',
      image: null,
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 1,
      linkUrl: '',
      targetAudience: 'all'
    });
  };

  const handleEditBanner = (banner) => {
    setEditingBanner({ ...banner });
    setShowEditModal(true);
    
    // Set form data for editing
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image,
      isActive: banner.isActive,
      startDate: banner.startDate,
      endDate: banner.endDate,
      priority: banner.priority,
      linkUrl: banner.linkUrl,
      targetAudience: banner.targetAudience
    });
  };

  const handleSaveBanner = async (bannerData) => {
    try {
      let imageUrl = '';
      
      console.log('Banner data received:', bannerData);
      
      // If there's an image (base64), try upload first, but fallback to base64
      if (bannerData.image && bannerData.image.startsWith('data:image/')) {
        console.log('Image detected, trying upload...');
        try {
          // Convert base64 to file
          const response = await fetch(bannerData.image);
          const blob = await response.blob();
          const file = new File([blob], 'banner-image.png', { type: 'image/png' });
          
          console.log('File created:', file);
          
          // Upload the file
          const uploadResult = await uploadAPI.uploadAdvertisementImage(file);
          console.log('Upload result:', uploadResult);
          
          imageUrl = uploadResult.data?.url || uploadResult.url || '';
          // Convert HTTP to HTTPS if needed
          if (imageUrl && imageUrl.startsWith('http://')) {
            imageUrl = imageUrl.replace('http://', 'https://');
          }
          console.log('Image URL:', imageUrl);
          
          // Test if the uploaded image is accessible
          if (imageUrl) {
            try {
              const testResponse = await fetch(imageUrl, { method: 'HEAD' });
              if (!testResponse.ok) {
                console.log('Uploaded image not accessible, using base64 as fallback');
                imageUrl = bannerData.image;
              }
            } catch (testError) {
              console.log('Cannot access uploaded image, using base64 as fallback');
              imageUrl = bannerData.image;
            }
          }
          
          // If upload failed, use base64 as fallback
          if (!imageUrl) {
            console.log('Upload failed, using base64 as fallback');
            imageUrl = bannerData.image;
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          console.log('Using base64 as fallback due to upload error');
          imageUrl = bannerData.image;
        }
      } else if (bannerData.imageUrl) {
        // If it's already a URL, use it
        imageUrl = bannerData.imageUrl;
        console.log('Using existing image URL:', imageUrl);
      }

      if (bannerData.id) {
        // Update existing banner
        const updateData = {
          ...bannerData,
          imageUrl: imageUrl
        };
        delete updateData.image; // Remove base64 image data
        await advertisementsAPI.update(bannerData.id, updateData);
        setBanners(banners.map(banner => 
          banner.id === bannerData.id ? { ...banner, ...updateData } : banner
        ));
      } else {
        // Create new banner
        const bannerToCreate = {
          ...bannerData,
          imageUrl: imageUrl,
          createdBy: user?.id || 1 // Use current user ID or fallback to 1
        };
        // Remove image field as it's not needed by backend
        delete bannerToCreate.image;
        
        console.log('Creating banner with data:', bannerToCreate);
        const newBanner = await advertisementsAPI.create(bannerToCreate);
        console.log('Banner created successfully:', newBanner);
        setBanners([...banners, newBanner]);
      }
      
      setShowCreateModal(false);
      setShowEditModal(false);
      setEditingBanner(null);
      
      // Reset form data
      setFormData({
        title: '',
        description: '',
        image: null,
        isActive: true,
        startDate: '',
        endDate: '',
        priority: 1,
        linkUrl: '',
        targetAudience: 'all'
      });
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Greška pri čuvanju bannera: ' + error.message);
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj banner?')) {
      try {
        await advertisementsAPI.delete(bannerId);
        setBanners(banners.filter(banner => banner.id !== bannerId));
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Greška pri brisanju bannera: ' + error.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Aktivan' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Neaktivan' },
      scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Zakazan' },
      expired: { color: 'bg-red-100 text-red-800', text: 'Istekao' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPositionBadge = (position) => {
    const positionConfig = {
      'homepage-top': { color: 'bg-blue-100 text-blue-800', text: 'Početna - Gore' },
      'homepage-sidebar': { color: 'bg-green-100 text-green-800', text: 'Početna - Bočno' },
      'services-page': { color: 'bg-purple-100 text-purple-800', text: 'Stranica Usluga' },
      'category-page': { color: 'bg-orange-100 text-orange-800', text: 'Stranica Kategorije' }
    };
    
    const config = positionConfig[position] || positionConfig['homepage-top'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Upravljanje Banerima</h1>
              <p className="text-muted-foreground mt-2">
                Kreirajte i upravljajte banerima za vašu platformu
              </p>
            </div>
            <Button onClick={handleCreateBanner} iconName="Plus">
              Novi Banner
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ukupno Banera</p>
                  <p className="text-2xl font-bold text-foreground">{banners.length}</p>
                </div>
                <Icon name="Image" size={24} className="text-blue-500" />
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aktivni</p>
                  <p className="text-2xl font-bold text-foreground">
                    {banners.filter(b => b.status === 'active').length}
                  </p>
                </div>
                <Icon name="CheckCircle" size={24} className="text-green-500" />
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ukupno Klikova</p>
                  <p className="text-2xl font-bold text-foreground">
                    {banners.reduce((sum, b) => sum + b.clicks, 0).toLocaleString()}
                  </p>
                </div>
                <Icon name="MousePointer" size={24} className="text-purple-500" />
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ukupno Prikaza</p>
                  <p className="text-2xl font-bold text-foreground">
                    {banners.reduce((sum, b) => sum + b.impressions, 0).toLocaleString()}
                  </p>
                </div>
                <Icon name="Eye" size={24} className="text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Pretraga</label>
              <Input
                placeholder="Pretražite banere..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                iconName="Search"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Svi Statusi</option>
                <option value="active">Aktivan</option>
                <option value="inactive">Neaktivan</option>
                <option value="scheduled">Zakazan</option>
                <option value="expired">Istekao</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBanners.map((banner) => (
            <div key={banner.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={banner.imageUrl || banner.image}
                  alt={banner.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  {getStatusBadge(banner.status)}
                  {getPositionBadge(banner.position)}
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                    Prioritet: {banner.priority}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">{banner.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{banner.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Početak:</span>
                    <span className="text-foreground">{banner.startDate}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Kraj:</span>
                    <span className="text-foreground">{banner.endDate}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Klikovi:</span>
                    <span className="text-foreground">{banner.clicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Prikazi:</span>
                    <span className="text-foreground">{banner.impressions.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBanner(banner)}
                    iconName="Edit"
                    className="flex-1"
                  >
                    Uredi
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Here you would show banner statistics
                      console.log('Banner statistics:', banner.id);
                    }}
                    iconName="BarChart3"
                    className="text-blue-500"
                  >
                    Statistika
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updatedBanner = { ...banner, status: banner.status === 'active' ? 'inactive' : 'active' };
                      const updatedBanners = banners.map(b => b.id === banner.id ? updatedBanner : b);
                      setBanners(updatedBanners);
                    }}
                    iconName={banner.status === 'active' ? 'Pause' : 'Play'}
                    className={banner.status === 'active' ? 'text-warning' : 'text-success'}
                  >
                    {banner.status === 'active' ? 'Pauziraj' : 'Aktiviraj'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBanner(banner.id)}
                    iconName="Trash2"
                    className="text-destructive hover:text-destructive"
                  >
                    Obriši
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBanners.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Image" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nema banera</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Pokušajte da promenite filtere' 
                : 'Kreirajte svoj prvi banner'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={handleCreateBanner} iconName="Plus">
                Kreiraj Banner
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <BannerModal
          banner={editingBanner}
          isOpen={showCreateModal || showEditModal}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setEditingBanner(null);
          }}
          onSave={handleSaveBanner}
          isEdit={showEditModal}
        />
      )}
    </div>
  );
};

// Banner Modal Component
const BannerModal = ({ banner, isOpen, onClose, onSave, isEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    isActive: true,
    startDate: '',
    endDate: '',
    priority: 1,
    linkUrl: '',
    targetAudience: 'all'
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        description: banner.description || '',
        image: banner.image || null,
        isActive: banner.isActive !== undefined ? banner.isActive : true,
        startDate: banner.startDate || '',
        endDate: banner.endDate || '',
        priority: banner.priority || 1,
        linkUrl: banner.linkUrl || '',
        targetAudience: banner.targetAudience || 'all'
      });
    }
  }, [banner]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...banner,
      ...formData
    });
  };

  const handleImageUpload = (file, imageData) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {isEdit ? 'Uredi Banner' : 'Kreiraj Novi Banner'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} iconName="X" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Naslov Banner
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Unesite naslov bannera"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <Select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(value) => setFormData(prev => ({ ...prev, isActive: value === 'active' }))}
                  options={[
                    { value: 'active', label: 'Aktivan' },
                    { value: 'inactive', label: 'Neaktivan' }
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Opis
              </label>
              <Input
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Unesite opis bannera"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ciljna Publika
                </label>
                <Select
                  value={formData.targetAudience}
                  onChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}
                  options={[
                    { value: 'all', label: 'Svi korisnici' },
                    { value: 'customers', label: 'Kupci' },
                    { value: 'workers', label: 'Radnici' },
                    { value: 'specific-category', label: 'Specifična kategorija' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Prioritet
                </label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Datum Početka
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Datum Kraja
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Link URL
              </label>
              <Input
                value={formData.linkUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                placeholder="https://example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Slika Banner
              </label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={formData.image}
                width={400}
                height={200}
                className="mx-auto"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => {
                onClose();
              }}>
                Otkaži
              </Button>
              <Button type="submit">
                {isEdit ? 'Sačuvaj Promene' : 'Kreiraj Banner'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Banners;
