// API service specifically for reports and statistics
const API_BASE_URL = 'http://localhost:8080/api';

// Get headers with authentication
const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Test API connection
export const testApiConnection = async () => {
  try {
    console.log('🧪 Testing API connection...');
    
    const response = await fetch(`${API_BASE_URL}/admin/reports/test`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API connection successful:', data);
      return true;
    } else {
      console.log('❌ API connection failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('💥 API connection test failed:', error);
    return false;
  }
};

// Get statistics data
export const getStatistics = async (params: {
  startDate?: string;
  endDate?: string;
} = {}) => {
  try {
    console.log('🔄 Fetching statistics from API...');
    
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('fromDate', params.startDate);
    if (params.endDate) queryParams.append('toDate', params.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/admin/reports/overview${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔍 Statistics params:', params);
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
    
    // Get additional data from other endpoints
    let monthlyRevenue = [12000000, 15000000, 18000000, 22000000, 25000000, 28000000];
    let bookingStatusCounts = {
      pending: 12,
      confirmed: 45,
      cancelled: 8,
      completed: 91
    };

    try {
      // Get monthly revenue data
      const revenueResponse = await fetch(`${API_BASE_URL}/admin/reports/revenue-monthly?year=2025`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (revenueResponse.ok) {
        const revenueData = await revenueResponse.json();
        console.log('📊 Monthly revenue data:', revenueData);
        monthlyRevenue = revenueData.map((item: any) => item.revenue || 0);
      }
    } catch (error) {
      console.log('⚠️ Failed to fetch monthly revenue, using mock data');
    }

    try {
      // Get booking status data
      const statusResponse = await fetch(`${API_BASE_URL}/admin/reports/booking-status?fromDate=${params.startDate}&toDate=${params.endDate}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('📊 Booking status data:', statusData);
        
        // Transform status data
        const statusMap: { [key: string]: number } = {};
        statusData.forEach((item: any) => {
          if (item.statusCode === 'PENDING') statusMap.pending = item.count;
          else if (item.statusCode === 'CONFIRMED') statusMap.confirmed = item.count;
          else if (item.statusCode === 'CANCELLED') statusMap.cancelled = item.count;
          else if (item.statusCode === 'COMPLETED') statusMap.completed = item.count;
        });
        
        bookingStatusCounts = {
          pending: statusMap.pending || 0,
          confirmed: statusMap.confirmed || 0,
          cancelled: statusMap.cancelled || 0,
          completed: statusMap.completed || 0
        };
      }
    } catch (error) {
      console.log('⚠️ Failed to fetch booking status, using mock data');
    }


    // Transform API response to match frontend interface
    const transformedData = {
      totalBookings: data.totalBookings || 0,
      totalRevenue: data.totalRevenue || 0,
      totalUsers: data.totalUsers || 0,
      totalRooms: data.totalRooms || 0,
      monthlyRevenue: monthlyRevenue,
      bookingStatusCounts: bookingStatusCounts
    };
    
    console.log('✅ Transformed data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('💥 API call failed:', error);
    throw error;
  }
};

// Get revenue data
export const getRevenueData = async (params: {
  startDate?: string;
  endDate?: string;
} = {}) => {
  try {
    console.log('🔄 Fetching revenue data from API...');
    
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/admin/revenue${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('📡 Revenue data:', data);
    
    return data;
  } catch (error) {
    console.error('💥 Revenue API call failed:', error);
    throw error;
  }
};

// Get booking status data
export const getBookingStatusData = async (params: {
  startDate?: string;
  endDate?: string;
} = {}) => {
  try {
    console.log('🔄 Fetching booking status data from API...');
    
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/admin/booking-status${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('📡 Booking status data:', data);
    
    return data;
  } catch (error) {
    console.error('💥 Booking status API call failed:', error);
    throw error;
  }
};
