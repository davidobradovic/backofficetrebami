import React, { useState, useEffect } from 'react';
import { categoriesAPI, subcategoriesAPI } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Pagination } from '../../components/ui/Pagination';
import { AppIcon } from '../../components/AppIcon';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, [currentPage, searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm
      });
      
      console.log('Categories API response:', response);
      
      // Backend returns { success: true, data: rows, pagination: {...} }
      if (response && response.success && response.data) {
        console.log('Setting categories:', response.data);
        console.log('Categories length:', response.data.length);
        setCategories(response.data);
        setFilteredCategories(response.data);
        setTotalPages(response.pagination?.pages || 1);
        setTotalItems(response.pagination?.total || response.data.length);
        console.log('Categories state set successfully');
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Show empty state instead of mock data
      setCategories([]);
      setFilteredCategories([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };


  // Handle search changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const isValidImageIcon = (icon) => {
    if (!icon) return false;
    // Check if it's an emoji (single character, not a filename)
    if (icon.length === 1 && !icon.includes('.')) return true;
    // Check if it's a valid image filename
    if (icon.includes('.') && (icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.jpeg') || icon.endsWith('.gif') || icon.endsWith('.svg'))) return true;
    return false;
  };

  const fetchSubcategories = async () => {
    try {
      const response = await subcategoriesAPI.getAll();
      if (response && response.success && response.data) {
        setSubcategories(response.data);
      } else if (Array.isArray(response)) {
        setSubcategories(response);
      } else {
        throw new Error('Invalid subcategories response format');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const filterCategories = () => {
    let filtered = categories.filter(category => {
      const matchesSearch = 
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    setFilteredCategories(filtered);
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowCreateModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const handleCreateSubcategory = (category) => {
    setSelectedCategory(category);
    setEditingSubcategory(null);
    setShowSubcategoryModal(true);
  };

  const handleEditSubcategory = (subcategory) => {
    setEditingSubcategory(subcategory);
    setShowSubcategoryModal(true);
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (editingCategory) {
        const response = await categoriesAPI.update(editingCategory.id, categoryData);
        setCategories(categories.map(c => c.id === editingCategory.id ? response.data : c));
        setShowEditModal(false);
      } else {
        const response = await categoriesAPI.create(categoryData);
        setCategories([...categories, response.data]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleSaveSubcategory = async (subcategoryData) => {
    try {
      if (editingSubcategory) {
        const response = await subcategoriesAPI.update(editingSubcategory.id, subcategoryData);
        setSubcategories(subcategories.map(s => s.id === editingSubcategory.id ? response.data : s));
        setShowSubcategoryModal(false);
      } else {
        const response = await subcategoriesAPI.create({
          ...subcategoryData,
          categoryId: selectedCategory.id
        });
        setSubcategories([...subcategories, response.data]);
        setShowSubcategoryModal(false);
        fetchCategories(); // Refresh to update subcategory counts
      }
    } catch (error) {
      console.error('Error saving subcategory:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
      try {
        await categoriesAPI.delete(categoryId);
        setCategories(categories.filter(c => c.id !== categoryId));
        setSubcategories(subcategories.filter(s => s.categoryId !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await subcategoriesAPI.delete(subcategoryId);
        setSubcategories(subcategories.filter(s => s.id !== subcategoryId));
        fetchCategories(); // Refresh to update subcategory counts
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    }
  };

  const handleToggleActive = async (categoryId) => {
    try {
      const category = categories.find(c => c.id === categoryId);
      const response = await categoriesAPI.update(categoryId, { isActive: !category.isActive });
      setCategories(categories.map(c => c.id === categoryId ? response.data : c));
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sr-RS');
  };

  const getCategorySubcategories = (categoryId) => {
    return subcategories.filter(s => s.categoryId === categoryId);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upravljanje kategorijama</h1>
        <Button onClick={handleCreateCategory} iconName="Plus">
          Dodaj novu kategoriju
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <Input
          placeholder="Pretražite kategorije..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          iconName="Search"
        />
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {console.log('Rendering categories, filteredCategories length:', filteredCategories.length)}
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {isValidImageIcon(category.icon) ? (
                    category.icon.length === 1 ? (
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                        {category.icon}
                      </div>
                    ) : (
                      <img
                        src={`/uploads/categories/${category.icon}`}
                        alt={category.title}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    )
                  ) : null}
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center" style={{ display: isValidImageIcon(category.icon) ? 'none' : 'flex' }}>
                    <AppIcon name="Grid3X3" className="w-10 h-10 text-gray-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600">{category.description || 'Nema opisa'}</p>
                </div>
                <button
                  onClick={() => toggleCategoryExpansion(category.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title={expandedCategories.has(category.id) ? 'Sakrij potkategorije' : 'Prikaži potkategorije'}
                >
                  <AppIcon 
                    name={expandedCategories.has(category.id) ? "ChevronUp" : "ChevronDown"} 
                    className="w-5 h-5 text-gray-600 hover:text-gray-800" 
                  />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {category.isActive ? 'Aktivan' : 'Neaktivan'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Potkategorije:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{category.subcategories?.length || 0}</span>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <span className="text-xs text-blue-600">
                        {expandedCategories.has(category.id) ? 'Prošireno' : 'Kliknite da proširite'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Narudžbe:</span>
                  <span className="text-sm font-medium">{category.ordersCount || 0}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Kreiran: {formatDate(category.createdAt)}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCreateSubcategory(category)}
                >
                  Dodaj potkategoriju
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleActive(category.id)}
                >
                  {category.isActive ? 'Deaktiviraj' : 'Aktiviraj'}
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditCategory(category)}
                >
                  Uredi
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Obriši
                </Button>
              </div>
            </div>

            {/* Subcategories List - Only show when expanded */}
            {expandedCategories.has(category.id) && category.subcategories && category.subcategories.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Potkategorije</h4>
                <div className="space-y-2">
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{subcategory.title}</p>
                        <p className="text-xs text-gray-600">{subcategory.description || 'Nema opisa'}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditSubcategory(subcategory)}
                        >
                          Uredi
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSubcategory(subcategory.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Obriši
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          ))}
        </div>
      )}

      {filteredCategories.length === 0 && !loading && (
        <div className="text-center py-12">
          <AppIcon name="Grid3X3" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nema pronađenih kategorija</h3>
          <p className="text-gray-600">Pokušajte da prilagodite kriterijume pretrage.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Create/Edit Category Modal */}
      {(showCreateModal || showEditModal) && (
        <CategoryModal
          category={editingCategory}
          isOpen={showCreateModal || showEditModal}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
          isEdit={showEditModal}
        />
      )}

      {/* Create/Edit Subcategory Modal */}
      {showSubcategoryModal && (
        <SubcategoryModal
          subcategory={editingSubcategory}
          category={selectedCategory}
          isOpen={showSubcategoryModal}
          onClose={() => {
            setShowSubcategoryModal(false);
            setEditingSubcategory(null);
            setSelectedCategory(null);
          }}
          onSave={handleSaveSubcategory}
          isEdit={!!editingSubcategory}
        />
      )}
    </div>
  );
};

// Category Modal Component
const CategoryModal = ({ category, isOpen, onClose, onSave, isEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: null,
    isActive: true
  });

  useEffect(() => {
    if (category) {
      setFormData({
        title: category.title || '',
        description: category.description || '',
        icon: category.icon || null,
        isActive: category.isActive !== undefined ? category.isActive : true
      });
    }
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      icon: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isEdit ? 'Uredi kategoriju' : 'Dodaj novu kategoriju'}
            </h2>
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
                Naziv kategorije *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Unesite naziv kategorije"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opis *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Unesite opis kategorije"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Icon
              </label>
              <ImageUpload
                onImageSelect={handleImageUpload}
                currentImage={formData.icon}
                className="w-full"
              />
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
                Aktivan
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Otkaži
              </Button>
              <Button type="submit">
                {isEdit ? 'Ažuriraj kategoriju' : 'Kreiraj kategoriju'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Subcategory Modal Component
const SubcategoryModal = ({ subcategory, category, isOpen, onClose, onSave, isEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    if (subcategory) {
      setFormData({
        title: subcategory.title || '',
        description: subcategory.description || '',
        isActive: subcategory.isActive !== undefined ? subcategory.isActive : true
      });
    }
  }, [subcategory]);

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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isEdit ? 'Uredi potkategoriju' : `Dodaj potkategoriju za ${category?.title}`}
            </h2>
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
                Naziv potkategorije *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Unesite naziv potkategorije"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opis *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Unesite opis potkategorije"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
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
                Aktivan
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Otkaži
              </Button>
              <Button type="submit">
                {isEdit ? 'Ažuriraj potkategoriju' : 'Kreiraj potkategoriju'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagement;