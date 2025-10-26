// API service specifically for notifications
const API_BASE_URL = 'http://localhost:8080/api';

// Get headers with authentication
const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Get notifications from API
export const getNotifications = async (params: {
  type?: string;
  status?: string;
  sortBy?: string;
  sortDir?: string;
} = {}) => {
  try {
    console.log('🔄 Fetching notifications from API...');
    
    const queryParams = new URLSearchParams();
    if (params.type && params.type !== 'ALL') queryParams.append('type', params.type);
    if (params.status && params.status !== 'ALL') queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);

    const queryString = queryParams.toString();
    const endpoint = `/admin/notifications${queryString ? `?${queryString}` : ''}`;
    
    console.log('🌐 API URL:', `${API_BASE_URL}${endpoint}`);
    console.log('🔑 Headers:', getHeaders());
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('📡 Raw API data:', data);
    
    // Handle different response formats
    if (Array.isArray(data)) {
      console.log('✅ Direct array response:', data.length, 'notifications');
      return data;
    } else if (data.notifications && Array.isArray(data.notifications)) {
      console.log('✅ Notifications property response:', data.notifications.length, 'notifications');
      return data.notifications;
    } else if (data.data && Array.isArray(data.data)) {
      console.log('✅ Data property response:', data.data.length, 'notifications');
      return data.data;
    } else {
      console.log('⚠️ Unknown response format, returning empty array');
      return [];
    }
  } catch (error) {
    console.error('💥 API call failed:', error);
    throw error;
  }
};

// Send notification
export const sendNotification = async (id: number) => {
  try {
    console.log('📤 Sending notification:', id);
    
    const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}/send`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Notification sent:', data);
    return data;
  } catch (error) {
    console.error('💥 Send notification failed:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (id: number) => {
  try {
    console.log('🗑️ Deleting notification:', id);
    
    const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    console.log('✅ Notification deleted');
    return true;
  } catch (error) {
    console.error('💥 Delete notification failed:', error);
    throw error;
  }
};
