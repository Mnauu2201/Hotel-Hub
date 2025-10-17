import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useNotification } from '../../hooks/useNotification';
import './AdminPages.css';

interface Amenity {
  amenityId: number;
  name: string;
  description: string;
  icon: string;
}

interface Room {
  id?: number;
  roomId?: number;
  name: string;
  roomNumber?: string;
  roomType: string;
  roomTypeId?: number;
  price: number;
  capacity: number;
  status: string;
  description?: string;
  amenities: (string | Amenity)[];
  amenityIds?: number[];
  images: string[];
}

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const { showSuccess, showError, showWarning, showInfo, NotificationContainer } = useNotification();
  
  // Form state
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomTypeId: 1, // Default to first room type ID
    price: 0,
    capacity: 1,
    description: '',
    status: 'AVAILABLE',
    amenityIds: [] as number[],
    imageUrls: [] as string[]
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  // Test API function
  const testAPI = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('/api/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
    } catch (error) {
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showError('Bạn cần đăng nhập để truy cập trang này');
        setRooms([]);
        return;
      }
      
      const response = await fetch('/api/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      
      if (response.ok) {
        const data = await response.json();
        // Đảm bảo data là array
        const roomsArray = Array.isArray(data) ? data : (data?.rooms || []);
        setRooms(roomsArray);
        
        if (roomsArray.length === 0) {
          showWarning('Không có phòng nào trong hệ thống');
        }
      } else {
        // Nếu API lỗi, set empty array
        setRooms([]);
        if (response.status === 401) {
          showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        } else if (response.status === 403) {
          showError('Bạn không có quyền truy cập trang này');
        } else {
          showError('Lỗi khi lấy danh sách phòng: ' + response.statusText);
        }
      }
    } catch (error) {
      // Nếu có lỗi, set empty array
      setRooms([]);
      showError('Lỗi kết nối khi lấy danh sách phòng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!roomId) {
      showError('Lỗi: Không tìm thấy ID phòng để xóa');
      return;
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        const token = localStorage.getItem('accessToken');
        
        const response = await fetch(`/api/rooms/${roomId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          showSuccess('Xóa phòng thành công!');
          setRooms(rooms.filter(room => (room.id || room.roomId) !== roomId));
        } else {
          const errorData = await response.json();
          showError('Lỗi: ' + (errorData.message || 'Không thể xóa phòng'));
        }
      } catch (error) {
        showError('Lỗi kết nối: ' + error.message);
      }
    }
  };

  const handleEditRoom = async (room: Room) => {
    const roomId = room.id || room.roomId;
    if (!roomId) {
      showError('Lỗi: Không tìm thấy ID phòng');
      return;
    }
    
    setEditingRoom(room);
    
    // Force fetch fresh room data from API
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/rooms/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const freshRoomData = await response.json();
        
        // Process fresh images from database
        let processedImages = [];
        if (freshRoomData.images && freshRoomData.images.length > 0) {
          processedImages = freshRoomData.images.map(img => {
            if (typeof img === 'string') {
              return img;
            }
            // Handle image objects from database
            return img.imageUrl || img.url || img;
          });
        }
        
        setFormData({
          roomNumber: freshRoomData.roomNumber || '',
          roomTypeId: freshRoomData.roomTypeId || 1,
          price: freshRoomData.price || 0,
          capacity: freshRoomData.capacity || 1,
          description: freshRoomData.description || '',
          status: freshRoomData.status || 'AVAILABLE',
          amenityIds: freshRoomData.amenityIds || [],
          imageUrls: processedImages
        });
      } else {
        // Fallback to existing room data
        let processedImages = [];
        if (room.images && room.images.length > 0) {
          processedImages = room.images.map(img => {
            if (typeof img === 'string') {
              return img;
            }
            return img.imageUrl || img.url || img;
          });
        }
        
        setFormData({
          roomNumber: room.roomNumber || room.name || '',
          roomTypeId: room.roomTypeId || 1,
          price: room.price || 0,
          capacity: room.capacity || 1,
          description: room.description || '',
          status: room.status || 'AVAILABLE',
          amenityIds: room.amenityIds || [],
          imageUrls: processedImages
        });
      }
    } catch (error) {
      // Fallback to existing room data
      let processedImages = [];
      if (room.images && room.images.length > 0) {
        processedImages = room.images.map(img => {
          if (typeof img === 'string') {
            return img;
          }
          return img.imageUrl || img.url || img;
        });
      }
      
      setFormData({
        roomNumber: room.roomNumber || room.name || '',
        roomTypeId: room.roomTypeId || 1,
        price: room.price || 0,
        capacity: room.capacity || 1,
        description: room.description || '',
        status: room.status || 'AVAILABLE',
        amenityIds: room.amenityIds || [],
        imageUrls: processedImages
      });
    }
    
    setShowAddModal(true);
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      roomTypeId: 1,
      price: 0,
      capacity: 1,
      description: '',
      status: 'AVAILABLE',
      amenityIds: [],
      imageUrls: []
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const roomId = editingRoom ? (editingRoom.id || editingRoom.roomId) : null;
      const url = editingRoom ? `/api/rooms/${roomId}` : '/api/rooms';
      const method = editingRoom ? 'PUT' : 'POST';
      
      // Convert formData to match backend expectations
      const submitData = {
        roomNumber: formData.roomNumber,
        roomTypeId: formData.roomTypeId,
        price: formData.price, // Backend expects BigDecimal, will convert from number
        status: formData.status, // Backend expects RoomStatus enum
        capacity: formData.capacity,
        description: formData.description,
        amenityIds: formData.amenityIds,
        imageUrls: formData.imageUrls || [] // Ensure imageUrls is always an array
      };
      
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      
      if (response.ok) {
        const result = await response.json();
        showSuccess(editingRoom ? 'Cập nhật phòng thành công!' : 'Thêm phòng thành công!');
        setShowAddModal(false);
        setEditingRoom(null);
        fetchRooms(); // Refresh the list
      } else {
        const errorData = await response.json();
        showError('Lỗi: ' + (errorData.message || 'Không thể lưu phòng'));
      }
    } catch (error) {
      showError('Lỗi kết nối: ' + error.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'price' || name === 'capacity' || name === 'roomTypeId' ? Number(value) : value
      };
      return newData;
    });
  };

  const handleAmenityChange = (amenityId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenityIds: checked 
        ? [...prev.amenityIds, amenityId]
        : prev.amenityIds.filter(id => id !== amenityId)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const token = localStorage.getItem('accessToken');
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const result = await response.json();
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls]
      }));
      
      // Upload successful - no alert needed
    } catch (error) {
      showError('Lỗi upload ảnh: ' + error.message);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { class: string; text: string } } = {
      'AVAILABLE': { class: 'status-available', text: 'AVAILABLE' },
      'OCCUPIED': { class: 'status-occupied', text: 'LOCKED' },
      'MAINTENANCE': { class: 'status-maintenance', text: 'LOCKED' },
      'LOCKED': { class: 'status-occupied', text: 'LOCKED' }
    };
    
    const statusInfo = statusMap[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  return (
    <AdminLayout title="Quản lý phòng" breadcrumb="Quản lý phòng">
      <NotificationContainer />
      <div className="admin-page">
        {/* Header Actions */}
        <div className="admin-page-actions">
          <button 
            className="btn-primary"
            onClick={handleAddRoom}
          >
            ➕ Thêm phòng mới
          </button>
          <button 
            className="btn-secondary"
            onClick={testAPI}
            style={{marginLeft: '10px'}}
          >
            🔧 Test API
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="rooms-grid">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : Array.isArray(rooms) && rooms.length > 0 ? (
          rooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-card-header">
                  <h3>Phòng {room.roomNumber || room.name}</h3>
                  {getStatusBadge(room.status)}
                </div>
                
                <div className="room-card-content">
                  <div className="room-info">
                    <p><strong>Loại phòng:</strong> {room.roomType}</p>
                    <p><strong>Giá:</strong> {room.price.toLocaleString('vi-VN')} VNĐ/đêm</p>
                    <p><strong>Sức chứa:</strong> {room.capacity} người</p>
                    <p><strong>Trạng thái:</strong> {room.status}</p>
                  </div>
                  
                  {Array.isArray(room.amenities) && room.amenities.length > 0 && (
                    <div className="room-amenities">
                      <strong>Tiện nghi:</strong>
                      <div className="amenities-list">
                        {room.amenities.map((amenity, index) => (
                          <span key={index} className="amenity-tag">
                            {typeof amenity === 'string' ? amenity : amenity?.name || amenity?.description || 'N/A'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>
                
                <div className="room-card-actions">
                  <button 
                    className="btn-action btn-edit"
                    onClick={() => {
                      handleEditRoom(room);
                    }}
                  >
                    ✏️ Sửa
                  </button>
                  <button 
                    className="btn-action btn-delete"
                    onClick={() => {
                      const roomId = room.id || room.roomId;
                      if (roomId) {
                        handleDeleteRoom(roomId);
                      } else {
                        showError('Lỗi: Không tìm thấy ID phòng để xóa');
                      }
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <p>Không có phòng nào được tìm thấy.</p>
              <button 
                className="btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                ➕ Thêm phòng đầu tiên
              </button>
            </div>
          )}
        </div>

        
        {/* Add/Edit Modal - Simplified */}
        {showAddModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddModal(false);
                setEditingRoom(null);
              }
            }}
          >
            <div 
              style={{
                backgroundColor: '#2d3748',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
                border: '1px solid #4a5568'
              }}
            >
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #4a5568',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1a202c'
              }}>
                <h2 style={{margin: 0, color: '#ffffff', fontWeight: 600}}>
                  {editingRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
                </h2>
                <button 
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#e2e8f0'
                  }}
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRoom(null);
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{padding: '1.5rem'}}>
                <form onSubmit={handleFormSubmit}>
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0'}}>
                      Số phòng:
                    </label>
                    <input 
                      type="text" 
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      placeholder="Nhập số phòng"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #4a5568',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        backgroundColor: '#1a202c',
                        color: '#e2e8f0'
                      }}
                      required
                    />
                  </div>
                  
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0'}}>
                      Loại phòng:
                    </label>
                    <select 
                      name="roomTypeId"
                      value={formData.roomTypeId}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #4a5568',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        backgroundColor: '#1a202c',
                        color: '#e2e8f0'
                      }}
                    >
                      <option value={1}>Phòng đơn</option>
                      <option value={2}>Phòng đôi</option>
                      <option value={3}>Suite</option>
                    </select>
                  </div>
                  
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0'}}>
                      Giá (VNĐ/đêm):
                    </label>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #4a5568',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        backgroundColor: '#1a202c',
                        color: '#e2e8f0'
                      }}
                      required
                    />
                  </div>
                  
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0'}}>
                      Sức chứa:
                    </label>
                    <input 
                      type="number" 
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #4a5568',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        backgroundColor: '#1a202c',
                        color: '#e2e8f0'
                      }}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0'}}>
                      Mô tả:
                    </label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #4a5568',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        backgroundColor: '#1a202c',
                        color: '#e2e8f0',
                        minHeight: '80px',
                        resize: 'vertical'
                      }}
                      rows={3}
                    />
                  </div>
                  
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0'}}>
                      Trạng thái:
                    </label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #4a5568',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        backgroundColor: '#1a202c',
                        color: '#e2e8f0'
                      }}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="LOCKED">Locked</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  </div>
                  
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0'}}>
                      Tiện ích:
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '0.5rem',
                      marginTop: '0.5rem'
                    }}>
                      {[
                        {id: 1, name: 'WiFi'},
                        {id: 2, name: 'TV'},
                        {id: 3, name: 'Air Conditioning'},
                        {id: 4, name: 'Safe'},
                        {id: 5, name: 'Minibar'},
                        {id: 6, name: 'Balcony'},
                        {id: 7, name: 'Ocean View'},
                        {id: 8, name: 'Pet Friendly'},
                        {id: 9, name: 'Room Service'},
                        {id: 10, name: 'Gym Access'}
                      ].map(amenity => (
                        <label key={amenity.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          backgroundColor: '#1a202c',
                          border: '1px solid #4a5568',
                          transition: 'all 0.2s'
                        }}>
                          <input
                            type="checkbox"
                            checked={formData.amenityIds.includes(amenity.id)}
                            onChange={(e) => handleAmenityChange(amenity.id, e.target.checked)}
                            style={{marginRight: '0.5rem', transform: 'scale(1.1)'}}
                          />
                          <span style={{color: '#e2e8f0', fontSize: '0.9rem'}}>{amenity.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Image Upload Section */}
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0'}}>
                      Ảnh phòng:
                    </label>
                    
                    {/* Upload Input */}
                    <div style={{marginBottom: '1rem'}}>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #4a5568',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          backgroundColor: '#1a202c',
                          color: '#e2e8f0'
                        }}
                      />
                      <small style={{color: '#a0aec0', fontSize: '0.8rem'}}>
                        Có thể chọn nhiều ảnh cùng lúc
                      </small>
                    </div>
                    
                    {/* Image Preview */}
                    {formData.imageUrls.length > 0 && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '0.5rem',
                        marginTop: '0.5rem'
                      }}>
                        {formData.imageUrls.map((url, index) => {
                          // Convert relative URLs to absolute backend URLs for preview
                          let imageUrl = url;
                          if (url && !url.startsWith('http')) {
                            if (url.startsWith('/uploads/')) {
                              imageUrl = 'http://localhost:8080' + url;
                            } else if (!url.startsWith('/')) {
                              imageUrl = 'http://localhost:8080/uploads/' + url;
                            } else {
                              imageUrl = 'http://localhost:8080' + url;
                            }
                          }
                          
                          return (
                            <div key={index} style={{
                              position: 'relative',
                              aspectRatio: '1',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              border: '1px solid #4a5568'
                            }}>
                              <img
                                src={imageUrl}
                                alt={`Room image ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA2MEM2MCA0NC43NzE1IDQ3LjIyODUgMzIgMzIgMzJDMTYuNzcxNSAzMiA0IDQ0LjcxNTQgNCA2MEM0IDc1LjI4NDYgMTYuNzcxNSA4OCAzMiA4OEM0Ny4yMjg1IDg4IDYwIDc1LjI4NDYgNjAgNjBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik01MCA3MEg3MFY5MEg1MFY3MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                }}
                              />
                              <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(239, 68, 68, 0.8)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ×
                            </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'flex-end',
                    marginTop: '2rem'
                  }}>
                    <button 
                      type="button" 
                      style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingRoom(null);
                      }}
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit" 
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {editingRoom ? 'Cập nhật' : 'Thêm phòng'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RoomManagement;
