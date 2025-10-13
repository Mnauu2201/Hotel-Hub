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
  id: number;
  name: string;
  roomType: string;
  price: number;
  capacity: number;
  status: string;
  amenities: (string | Amenity)[];
  images: string[];
}

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

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
      console.error('Error fetching rooms:', error);
      // Nếu có lỗi, set empty array
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
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
          setRooms(rooms.filter(room => room.id !== roomId));
        }
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { class: string; text: string } } = {
      'AVAILABLE': { class: 'status-available', text: 'Available' },
      'OCCUPIED': { class: 'status-occupied', text: 'Đã thuê' },
      'LOCKED': { class: 'status-locked', text: 'LOCKED' },
      'MAINTENANCE': { class: 'status-maintenance', text: 'Bảo trì' }
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
            onClick={() => setShowAddModal(true)}
          >
            ➕ Thêm phòng mới
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
                  <h3>{room.name}</h3>
                  {getStatusBadge(room.status)}
                </div>
                
                <div className="room-card-content">
                  <div className="room-info">
                    <p><strong>Loại phòng:</strong> {room.roomType}</p>
                    <p><strong>Giá:</strong> {room.price.toLocaleString('vi-VN')} VNĐ/đêm</p>
                    <p><strong>Sức chứa:</strong> {room.capacity} người</p>
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
                    onClick={() => setEditingRoom(room)}
                  >
                    ✏️ Sửa
                  </button>
                  <button 
                    className="btn-action btn-delete"
                    onClick={() => handleDeleteRoom(room.id)}
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

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Thêm phòng mới</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-content">
                <form>
                  <div className="form-group">
                    <label>Tên phòng:</label>
                    <input type="text" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Loại phòng:</label>
                    <select className="form-select">
                      <option value="SINGLE">Phòng đơn</option>
                      <option value="DOUBLE">Phòng đôi</option>
                      <option value="SUITE">Suite</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Giá (VNĐ/đêm):</label>
                    <input type="number" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Sức chứa:</label>
                    <input type="number" className="form-input" />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                      Hủy
                    </button>
                    <button type="submit" className="btn-primary">
                      Thêm phòng
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
