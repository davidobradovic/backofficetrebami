// API configuration and utility functions
const API_BASE_URL = '/api'; // local proxy to backend server

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to get headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    mode: 'cors',
    headers: getHeaders(options.includeAuth !== false),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Return data directly if response has success/data structure, otherwise return the whole response
    if (result.success && result.data !== undefined) {
      return result;
    }
    
    return result;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const url = `${API_BASE_URL}/users/login`;
    const config = {
      mode: 'cors',
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API call failed for /users/login:`, error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
  },
  
  isAuthenticated: () => {
    return !!getAuthToken();
  }
};

// Users API
export const usersAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.role) queryParams.append('role', params.role);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    
    return apiCall(endpoint);
  },
  
  getById: async (id) => {
    return apiCall(`/users/${id}`);
  },
  
  getStats: async () => {
    return apiCall('/users/stats/overview');
  },
  
  create: async (userData) => {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  update: async (id, userData) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },
  
  toggleBan: async (id) => {
    return apiCall(`/users/${id}/ban`, {
      method: 'POST',
    });
  },
  
  changePassword: async (id, passwordData) => {
    return apiCall(`/users/${id}/change-password`, {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }
};

// Workers API
export const workersAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.verified) queryParams.append('verified', params.verified);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/workers?${queryString}` : '/workers';
    
    return apiCall(endpoint);
  },
  
  getById: async (id) => {
    return apiCall(`/workers/${id}`);
  },
  
  getNearby: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/workers/nearby?${queryString}`);
  },
  
  getStats: async () => {
    return apiCall('/workers/stats/overview');
  },
  
  create: async (workerData) => {
    return apiCall('/workers', {
      method: 'POST',
      body: JSON.stringify(workerData),
    });
  },
  
  update: async (id, workerData) => {
    return apiCall(`/workers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workerData),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/workers/${id}`, {
      method: 'DELETE',
    });
  },
  
  toggleAvailability: async (id) => {
    return apiCall(`/workers/${id}/toggle-availability`, {
      method: 'POST',
    });
  },
  
  toggleVerification: async (id) => {
    return apiCall(`/workers/${id}/toggle-verification`, {
      method: 'POST',
    });
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.active) queryParams.append('active', params.active);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/categories?${queryString}` : '/categories';
    
    return apiCall(endpoint);
  },
  
  getById: async (id) => {
    return apiCall(`/categories/${id}`);
  },
  
  getStats: async () => {
    return apiCall('/categories/stats/overview');
  },
  
  create: async (categoryData) => {
    return apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },
  
  update: async (id, categoryData) => {
    return apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/categories/${id}`, {
      method: 'DELETE',
    });
  }
};

// Subcategories API
export const subcategoriesAPI = {
  getAll: async () => {
    return apiCall('/subcategories');
  },
  
  getById: async (id) => {
    return apiCall(`/subcategories/${id}`);
  },
  
  getByCategory: async (categoryId) => {
    return apiCall(`/subcategories/category/${categoryId}`);
  },
  
  getStats: async () => {
    return apiCall('/subcategories/stats/overview');
  },
  
  create: async (subcategoryData) => {
    return apiCall('/subcategories', {
      method: 'POST',
      body: JSON.stringify(subcategoryData),
    });
  },
  
  update: async (id, subcategoryData) => {
    return apiCall(`/subcategories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subcategoryData),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/subcategories/${id}`, {
      method: 'DELETE',
    });
  }
};

// Orders API
export const ordersAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.customerId) queryParams.append('customerId', params.customerId);
    if (params.workerId) queryParams.append('workerId', params.workerId);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    
    return apiCall(endpoint);
  },
  
  getById: async (id) => {
    return apiCall(`/orders/${id}`);
  },
  
  getByOrderNumber: async (orderNumber) => {
    return apiCall(`/orders/number/${orderNumber}`);
  },
  
  getByCustomer: async (customerId) => {
    return apiCall(`/orders/customer/${customerId}`);
  },
  
  getByWorker: async (workerId) => {
    return apiCall(`/orders/worker/${workerId}`);
  },
  
  getStats: async () => {
    return apiCall('/orders/stats/overview');
  },
  
  create: async (orderData) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  
  update: async (id, orderData) => {
    return apiCall(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
  
  updateStatus: async (id, statusData) => {
    return apiCall(`/orders/${id}/status`, {
      method: 'POST',
      body: JSON.stringify(statusData),
    });
  }
};

// Messages API
export const messagesAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.senderId) queryParams.append('senderId', params.senderId);
    if (params.receiverId) queryParams.append('receiverId', params.receiverId);
    if (params.unreadOnly) queryParams.append('unreadOnly', params.unreadOnly);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/messages?${queryString}` : '/messages';
    
    return apiCall(endpoint);
  },
  
  getById: async (id) => {
    return apiCall(`/messages/${id}`);
  },
  
  getByOrder: async (orderId) => {
    return apiCall(`/messages/order/${orderId}`);
  },
  
  getConversation: async (userId1, userId2, orderId) => {
    return apiCall(`/messages/conversation?userId1=${userId1}&userId2=${userId2}&orderId=${orderId}`);
  },
  
  getUnreadCount: async (userId) => {
    return apiCall(`/messages/user/${userId}/unread-count`);
  },
  
  getStats: async () => {
    return apiCall('/messages/stats/overview');
  },
  
  create: async (messageData) => {
    return apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
  
  update: async (id, messageData) => {
    return apiCall(`/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(messageData),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/messages/${id}`, {
      method: 'DELETE',
    });
  },
  
  markAsRead: async (id) => {
    return apiCall(`/messages/${id}/read`, {
      method: 'POST',
    });
  },
  
  markAllAsRead: async (orderId, userId) => {
    return apiCall(`/messages/read-all?orderId=${orderId}&userId=${userId}`, {
      method: 'POST',
    });
  }
};

// Dashboard API
export const dashboardAPI = {
  getOverview: async () => {
    return apiCall('/dashboard/overview');
  },
  
  getRevenueAnalytics: async () => {
    return apiCall('/dashboard/revenue');
  },
  
  getUserAnalytics: async () => {
    return apiCall('/dashboard/users');
  },
  
  getOrderAnalytics: async () => {
    return apiCall('/dashboard/orders');
  },
  
  getGeographicAnalytics: async () => {
    return apiCall('/dashboard/geographic');
  },
  
  getPerformanceMetrics: async () => {
    return apiCall('/dashboard/performance');
  }
};

// Advertisements API
export const advertisementsAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.active) queryParams.append('active', params.active);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/advertisements?${queryString}` : '/advertisements';
    
    return apiCall(endpoint);
  },
  
  getById: async (id) => {
    return apiCall(`/advertisements/${id}`);
  },
  
  getActive: async () => {
    return apiCall('/advertisements/active', { includeAuth: false });
  },
  
  getStats: async () => {
    return apiCall('/advertisements/stats/overview');
  },
  
  create: async (advertisementData) => {
    return apiCall('/advertisements', {
      method: 'POST',
      body: JSON.stringify(advertisementData),
    });
  },
  
  update: async (id, advertisementData) => {
    return apiCall(`/advertisements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(advertisementData),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/advertisements/${id}`, {
      method: 'DELETE',
    });
  },
  
  toggleStatus: async (id) => {
    return apiCall(`/advertisements/${id}/toggle-status`, {
      method: 'POST',
    });
  },
  
  recordImpression: async (id) => {
    return apiCall(`/advertisements/${id}/impression`, {
      method: 'POST',
      includeAuth: false,
    });
  },
  
  recordClick: async (id) => {
    return apiCall(`/advertisements/${id}/click`, {
      method: 'POST',
      includeAuth: false,
    });
  }
};

// File Upload API
export const uploadAPI = {
  uploadFile: async (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/upload/${type}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed! status: ${response.status}`);
    }
    
    return await response.json();
  },
  
  uploadProfileImage: async (file) => {
    return uploadAPI.uploadFile(file, 'profile');
  },
  
  uploadAdvertisementImage: async (file) => {
    return uploadAPI.uploadFile(file, 'advertisement');
  },
  
  uploadCategoryIcon: async (file) => {
    return uploadAPI.uploadFile(file, 'category');
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    return apiCall('/health', { includeAuth: false });
  }
};

export default {
  authAPI,
  usersAPI,
  workersAPI,
  categoriesAPI,
  subcategoriesAPI,
  ordersAPI,
  messagesAPI,
  dashboardAPI,
  advertisementsAPI,
  uploadAPI,
  healthAPI
};
