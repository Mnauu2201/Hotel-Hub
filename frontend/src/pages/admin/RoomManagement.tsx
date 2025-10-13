import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminPages.css';

interface Amenity {
  amenityId: number;
  name: string;
  description: string;
  icon: string;
}

interface Room {
  id?: number;
  roomId?: number; // Alternative field name from API
  name?: string;
  roomNumber?: string; // Alternative field name from API
  roomType?: string;
  roomTypeName?: string; // Alternative field name from API
  price?: number;
  capacity?: number;
  status?: string;
  amenities?: (string | Amenity)[];
  images?: string[];
}

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState({
    name: '',
    roomType: 'SINGLE',
    price: 0,
    capacity: 1,
    status: 'AVAILABLE',
    amenities: [] as string[]
  });

  // Available amenities
  const availableAmenities = [
    { id: 1, name: 'WiFi', icon: '📶' },
    { id: 2, name: 'TV', icon: '📺' },
    { id: 3, name: 'Air Conditioning', icon: '❄️' },
    { id: 4, name: 'Safe', icon: '🔒' },
    { id: 5, name: 'Minibar', icon: '🍷' },
    { id: 6, name: 'Balcony', icon: '🏖️' },
    { id: 7, name: 'Ocean View', icon: '🌊' },
    { id: 8, name: 'Pet Friendly', icon: '🐕' },
    { id: 9, name: 'Room Service', icon: '🍽️' },
    { id: 10, name: 'Gym Access', icon: '💪' }
  ];

  // Notification states
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
  }>({
    show: false,
    type: 'info',
    message: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  // Show notification function
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({
      show: true,
      type,
      message
    });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Handle amenity selection
  const toggleAmenity = (amenityName: string) => {
    setNewRoom(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter(a => a !== amenityName)
        : [...prev.amenities, amenityName]
    }));
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
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
      } else {
        // Nếu API lỗi, set empty array
        setRooms([]);
      }
    } catch (error) {
      // Nếu có lỗi, set empty array
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = (room: Room) => {
    setDeletingRoom(room);
    setShowDeleteModal(true);
  };

  const confirmDeleteRoom = async () => {
    if (!deletingRoom) return;
    
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (!token) {
        showNotification('error', 'Vui lòng đăng nhập để tiếp tục');
        return;
      }

      // Get the correct ID field
      const roomId = deletingRoom.id || deletingRoom.roomId;
      
      if (!roomId) {
        showNotification('error', 'Lỗi: Không tìm thấy ID phòng');
        return;
      }
      
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      
      if (response.ok) {
        // Xóa phòng khỏi danh sách
        setRooms(rooms.filter(room => (room.id || room.roomId) !== roomId));
        setShowDeleteModal(false);
        setDeletingRoom(null);
        showNotification('success', 'Xóa phòng thành công!');
      } else {
        let errorMessage = `Lỗi ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        showNotification('error', `Lỗi xóa phòng: ${errorMessage}`);
      }
    } catch (error) {
      showNotification('error', `Lỗi kết nối: ${error}`);
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    // Set amenities for editing
    const roomAmenities = Array.isArray(room.amenities) 
      ? room.amenities.map(amenity => typeof amenity === 'string' ? amenity : amenity?.name || '')
      : [];
    setNewRoom(prev => ({ ...prev, amenities: roomAmenities }));
    setShowEditModal(true);
  };

  const handleAddRoom = () => {
    setNewRoom({
      name: '',
      roomType: 'SINGLE',
      price: 0,
      capacity: 1,
      status: 'AVAILABLE',
      amenities: []
    });
    setShowAddModal(true);
  };

  const handleSaveRoom = async (roomData: any, isEdit: boolean = false) => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (!token) {
        showNotification('error', 'Vui lòng đăng nhập để tiếp tục');
        return;
      }

      const editRoomId = editingRoom?.id || editingRoom?.roomId;
      const url = isEdit ? `/api/rooms/${editRoomId}` : '/api/rooms';
      const method = isEdit ? 'PUT' : 'POST';
      
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomData)
      });
      
      
      if (response.ok) {
        if (isEdit) {
          setRooms(rooms.map(room => (room.id || room.roomId) === editRoomId ? { ...room, ...roomData } : room));
          setShowEditModal(false);
          showNotification('success', 'Cập nhật phòng thành công!');
        } else {
          const responseData = await response.json();
          const newRoomData = responseData.room || responseData;
          setRooms([...rooms, newRoomData]);
          setShowAddModal(false);
          showNotification('success', 'Thêm phòng thành công!');
        }
        setEditingRoom(null);
      } else {
        let errorMessage = `Lỗi ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        showNotification('error', `Lỗi lưu phòng: ${errorMessage}`);
      }
    } catch (error) {
      showNotification('error', `Lỗi kết nối: ${error}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { class: string; text: string } } = {
      'AVAILABLE': { class: 'status-available', text: 'Available' },
      'available': { class: 'status-available', text: 'Available' },
      'LOCKED': { class: 'status-locked', text: 'Locked' },
      'locked': { class: 'status-locked', text: 'Locked' },
      'BOOKED': { class: 'status-booked', text: 'Booked' },
      'booked': { class: 'status-booked', text: 'Booked' },
      'OCCUPIED': { class: 'status-booked', text: 'Booked' }, // Map OCCUPIED to BOOKED
      'occupied': { class: 'status-booked', text: 'Booked' },
      'MAINTENANCE': { class: 'status-locked', text: 'Locked' }, // Map MAINTENANCE to LOCKED
      'maintenance': { class: 'status-locked', text: 'Locked' }
    };
    
    const statusInfo = statusMap[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  return (
    <AdminLayout title="Quản lý phòng" breadcrumb="Quản lý phòng">
      <div className="admin-page">
        {/* Header Actions */}
        <div className="admin-page-actions">
          <button 
            className="btn-primary"
            onClick={handleAddRoom}
          >
            ➕ Thêm phòng mới
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="rooms-grid">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : Array.isArray(rooms) && rooms.length > 0 ? (
          rooms.map((room, index) => (
              <div key={room.id || room.roomId || index} className="room-card">
                <div className="room-card-header">
                  <h3>{room.name || room.roomNumber || `Phòng ${room.id || room.roomId}`}</h3>
                  {getStatusBadge(room.status || 'AVAILABLE')}
                </div>
                
                <div className="room-card-content">
                  <div className="room-info">
                    <p><strong>Loại phòng:</strong> {room.roomType || room.roomTypeName || 'N/A'}</p>
                    <p><strong>Giá:</strong> {(room.price || 0).toLocaleString('vi-VN')} VNĐ/đêm</p>
                    <p><strong>Sức chứa:</strong> {room.capacity || 1} người</p>
                  </div>
                  
                  {Array.isArray(room.amenities) && room.amenities.length > 0 && (
                    <div className="room-amenities">
                      <strong>Tiện nghi:</strong>
                      <div className="amenities-list">
                        {room.amenities.map((amenity, amenityIndex) => (
                          <span key={amenityIndex} className="amenity-tag">
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
                    onClick={() => handleEditRoom(room)}
                  >
                    ✏️ Sửa
                  </button>
                  <button 
                    className="btn-action btn-delete"
                    onClick={() => handleDeleteRoom(room)}
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

        {/* Add Modal */}
        {showAddModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 999999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={() => setShowAddModal(false)}
          >
            <div 
              style={{
                backgroundColor: document.body.classList.contains('dark-mode') ? '#2d3748' : 'white',
                color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                padding: '30px',
                border: '2px solid #3182ce',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ margin: '0 0 20px 0', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Thêm phòng mới</h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const roomData = {
                  roomNumber: formData.get('name') as string,
                  roomTypeId: 1, // Default room type ID
                  price: parseFloat(formData.get('price') as string) || 0,
                  capacity: parseInt(formData.get('capacity') as string) || 1,
                  status: formData.get('status') as string,
                  amenityIds: newRoom.amenities.map(amenity => 
                    availableAmenities.find(a => a.name === amenity)?.id || 1
                  )
                };
                handleSaveRoom(roomData, false);
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Tên phòng:</label>
                  <input 
                    type="text" 
                    name="name"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Loại phòng:</label>
                  <select 
                    value={newRoom.roomType}
                    onChange={(e) => setNewRoom({...newRoom, roomType: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  >
                    <option value="SINGLE">Phòng đơn</option>
                    <option value="DOUBLE">Phòng đôi</option>
                    <option value="SUITE">Suite</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Giá (VNĐ/đêm):</label>
                  <input 
                    type="number" 
                    name="price"
                    value={newRoom.price}
                    onChange={(e) => setNewRoom({...newRoom, price: parseInt(e.target.value) || 0})}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Sức chứa:</label>
                  <input 
                    type="number" 
                    name="capacity"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 1})}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                    min="1"
                    required
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Trạng thái:</label>
                  <select 
                    name="status"
                    value={newRoom.status}
                    onChange={(e) => setNewRoom({...newRoom, status: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="LOCKED">Locked</option>
                    <option value="BOOKED">Booked</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Tiện ích:</label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                    gap: '8px',
                    padding: '12px',
                    border: document.body.classList.contains('dark-mode') ? '2px solid #4a5568' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : '#f8f9fa'
                  }}>
                    {availableAmenities.map((amenity) => (
                      <label 
                        key={amenity.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: newRoom.amenities.includes(amenity.name) 
                            ? (document.body.classList.contains('dark-mode') ? '#3182ce' : '#e3f2fd')
                            : 'transparent',
                          border: newRoom.amenities.includes(amenity.name)
                            ? '2px solid #3182ce'
                            : '2px solid transparent',
                          transition: 'all 0.2s ease',
                          color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                          fontSize: '13px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={newRoom.amenities.includes(amenity.name)}
                          onChange={() => toggleAmenity(amenity.name)}
                          style={{ margin: 0, transform: 'scale(0.9)' }}
                        />
                        <span style={{ fontSize: '14px' }}>{amenity.icon}</span>
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>{amenity.name}</span>
                      </label>
                    ))}
                  </div>
                  {newRoom.amenities.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ fontSize: '11px', color: document.body.classList.contains('dark-mode') ? '#a0aec0' : '#6b7280' }}>
                        Đã chọn: {newRoom.amenities.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{ 
                      padding: '10px 20px', 
                      fontSize: '16px',
                      backgroundColor: '#e2e8f0',
                      color: '#4a5568',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    style={{ 
                      padding: '10px 20px', 
                      fontSize: '16px',
                      backgroundColor: '#3182ce',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Thêm phòng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingRoom && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 999999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={() => setShowEditModal(false)}
          >
            <div 
              style={{
                backgroundColor: document.body.classList.contains('dark-mode') ? '#2d3748' : 'white',
                color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                padding: '30px',
                border: '2px solid #3182ce',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ margin: '0 0 20px 0', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Chỉnh sửa phòng</h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const roomData = {
                  roomNumber: formData.get('name') as string,
                  roomTypeId: 1, // Default room type ID
                  price: parseFloat(formData.get('price') as string) || 0,
                  capacity: parseInt(formData.get('capacity') as string) || 1,
                  status: formData.get('status') as string,
                  amenityIds: newRoom.amenities.map(amenity => 
                    availableAmenities.find(a => a.name === amenity)?.id || 1
                  )
                };
                handleSaveRoom(roomData, true);
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Tên phòng:</label>
                  <input 
                    type="text" 
                    name="name"
                    defaultValue={editingRoom.name || editingRoom.roomNumber || ''}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Loại phòng:</label>
                  <select 
                    name="roomType"
                    defaultValue={editingRoom.roomType || editingRoom.roomTypeName || 'SINGLE'}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  >
                    <option value="SINGLE">Phòng đơn</option>
                    <option value="DOUBLE">Phòng đôi</option>
                    <option value="SUITE">Suite</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Giá (VNĐ/đêm):</label>
                  <input 
                    type="number" 
                    name="price"
                    defaultValue={editingRoom.price || 0}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Sức chứa:</label>
                  <input 
                    type="number" 
                    name="capacity"
                    defaultValue={editingRoom.capacity || 1}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                    min="1"
                    required
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Trạng thái:</label>
                  <select 
                    name="status"
                    defaultValue={editingRoom.status || 'AVAILABLE'}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="LOCKED">Locked</option>
                    <option value="BOOKED">Booked</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Tiện ích:</label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                    gap: '8px',
                    padding: '12px',
                    border: document.body.classList.contains('dark-mode') ? '2px solid #4a5568' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : '#f8f9fa'
                  }}>
                    {availableAmenities.map((amenity) => (
                      <label 
                        key={amenity.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: newRoom.amenities.includes(amenity.name) 
                            ? (document.body.classList.contains('dark-mode') ? '#3182ce' : '#e3f2fd')
                            : 'transparent',
                          border: newRoom.amenities.includes(amenity.name)
                            ? '2px solid #3182ce'
                            : '2px solid transparent',
                          transition: 'all 0.2s ease',
                          color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                          fontSize: '13px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={newRoom.amenities.includes(amenity.name)}
                          onChange={() => toggleAmenity(amenity.name)}
                          style={{ margin: 0, transform: 'scale(0.9)' }}
                        />
                        <span style={{ fontSize: '14px' }}>{amenity.icon}</span>
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>{amenity.name}</span>
                      </label>
                    ))}
                  </div>
                  {newRoom.amenities.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ fontSize: '11px', color: document.body.classList.contains('dark-mode') ? '#a0aec0' : '#6b7280' }}>
                        Đã chọn: {newRoom.amenities.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    style={{ 
                      padding: '10px 20px', 
                      fontSize: '16px',
                      backgroundColor: '#e2e8f0',
                      color: '#4a5568',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    style={{ 
                      padding: '10px 20px', 
                      fontSize: '16px',
                      backgroundColor: '#3182ce',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingRoom && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 999999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={() => setShowDeleteModal(false)}
          >
            <div 
              style={{
                backgroundColor: document.body.classList.contains('dark-mode') ? '#2d3748' : 'white',
                color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                padding: '30px',
                border: '2px solid #ef4444',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '90%'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ margin: '0 0 20px 0', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Xác nhận xóa</h2>
              <p style={{ marginBottom: '20px' }}>
                Bạn có chắc chắn muốn xóa phòng <strong>{deletingRoom.name || deletingRoom.roomNumber || `ID: ${deletingRoom.id || deletingRoom.roomId}`}</strong>?
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  style={{ 
                    padding: '10px 20px', 
                    fontSize: '16px',
                    backgroundColor: '#e2e8f0',
                    color: '#4a5568',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button 
                  onClick={confirmDeleteRoom}
                  style={{ 
                    padding: '10px 20px', 
                    fontSize: '16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Notification */}
        {notification.show && (
          <div 
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 1000000,
              padding: '15px 20px',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              maxWidth: '400px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              backgroundColor: notification.type === 'success' ? '#10b981' : 
                             notification.type === 'error' ? '#ef4444' : '#3b82f6',
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            {notification.message}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RoomManagement;
