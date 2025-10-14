import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserModal.css';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { top: number; left: number };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, position }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, updateProfile } = useAuth();

  // Khởi tạo dữ liệu từ user hiện tại
  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setError('');
      setSuccess('');
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateProfile(name, phone);
      setSuccess('Cập nhật thông tin thành công!');
      
      // Đóng modal sau khi cập nhật thành công
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (err: any) {
      setError(err?.message || 'Cập nhật thông tin thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="user-modal-overlay" onClick={handleClose}>
      <div 
        className="user-modal" 
        onClick={(e) => e.stopPropagation()}
        style={position ? {
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'none'
        } : {}}
      >
        <div className="user-modal-header">
          <h3>Sửa thông tin cá nhân</h3>
          <button className="user-modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="user-modal-content">
          {error && <div className="user-modal-error">{error}</div>}
          {success && <div className="user-modal-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="user-modal-form-group">
              <label htmlFor="edit-name">Họ và tên</label>
              <input
                type="text"
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            
            <div className="user-modal-form-group">
              <label htmlFor="edit-phone">Số điện thoại</label>
              <input
                type="tel"
                id="edit-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại (10-11 chữ số)"
                pattern="[0-9]{10,11}"
                required
              />
            </div>

            <div className="user-modal-form-group">
              <label htmlFor="edit-email">Email</label>
              <input
                type="email"
                id="edit-email"
                value={user?.email || ''}
                disabled
                className="disabled-input"
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  cursor: 'not-allowed'
                }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Email không thể thay đổi
              </small>
            </div>

            <div className="user-modal-buttons">
              <button 
                type="button" 
                className="user-modal-button user-modal-button-secondary" 
                onClick={handleClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="user-modal-button" 
                disabled={loading}
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
