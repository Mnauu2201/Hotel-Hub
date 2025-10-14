import { Link } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../assets/img/logo/logo.png'
import UserModal from '../user/UserModal'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { user, isAuthenticated, logout, getUserAvatar, updateProfile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const [userIconPosition, setUserIconPosition] = useState({ top: 0, left: 0 });

  const handleUserIconClick = (e: React.MouseEvent) => {
    const iconElement = e.currentTarget as HTMLElement;
    const rect = iconElement.getBoundingClientRect();
    
    setUserIconPosition({
      top: rect.bottom,
      left: rect.left - 200 // Điều chỉnh vị trí để modal hiển thị dưới icon
    });
    
    if (isAuthenticated) {
      // Toggle menu khi đã đăng nhập
      setIsMenuOpen(prev => !prev);
    } else {
      // Nếu chưa đăng nhập, mở modal đăng nhập
      setIsUserModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditError('');
    setEditSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditName('');
    setEditPhone('');
    setEditError('');
    setEditSuccess('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    setEditLoading(true);

    try {
      await updateProfile(editName, editPhone);
      setEditSuccess('Cập nhật thông tin thành công!');
      setTimeout(() => {
        setIsEditingProfile(false);
        setEditSuccess('');
      }, 1500);
    } catch (err: any) {
      setEditError(err?.message || 'Cập nhật thông tin thất bại');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <header className="header-area header-three">
      <div className="header-top second-header d-none d-md-block">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-10 col-md-10 d-none d-lg-block">
              <div className="header-cta">
                <ul>
                  <li>
                    <i className="far fa-clock" />
                    <span>Thứ Hai - Thứ Sáu: 9:00 - 19:00/ Đóng cửa cuối tuần</span>
                  </li>
                  <li>
                    <i className="far fa-mobile" />
                    <strong>+84 777 666 555</strong>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-2 d-none d-lg-block text-right">
              <div className="header-social">
                <span>
                  <Link to="#" title="Facebook"><i className="fab fa-facebook-f" /></Link>
                  <Link to="#" title="LinkedIn"><i className="fab fa-instagram" /></Link>
                  <Link to="#" title="Twitter"><i className="fab fa-twitter" /></Link>
                  <Link to="#" title="Twitter"><i className="fab fa-youtube" /></Link>
                </span>
                {/*  /social media icon redux */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="header-sticky" className="menu-area">
        <div className="container">
          <div className="second-menu">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-2">
                <div className="logo">
                  <Link to="/"><img src={logo} alt="logo" /></Link>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8">
                <div className="main-menu text-center">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="has-sub">
                        <Link to="/">Trang chủ</Link>
                      </li>
                      <li><Link to="/about">Giới thiệu</Link></li>
                      <li className="has-sub">
                        <Link to="/room">Phòng của chúng tôi</Link>
                        
                      </li>
                      <li className="has-sub">
                        <Link to="/services">Dịch vụ</Link>
                        
                      </li>
                      <li className="has-sub"><Link to="#">Trang</Link>
                        <ul>
                          {/* <li><Link to="/gallery">Gallery</Link></li> */}
                          <li><Link to="/faq">Hỏi đáp</Link></li>
                          <li><Link to="/team">Đội ngũ</Link></li>
                          
                          {/* <li><Link to="/shop">Shop</Link></li> */}
                          {/* <li><Link to="/shop-details">Shop Details</Link></li> */}
                        </ul>
                      </li>
                      <li className="has-sub">
                        <Link to="/blog">Tin tức</Link>
                       
                      </li>
                      <li><Link to="/contact">Liên hệ</Link></li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 d-none d-lg-block" style={{ position: 'relative' }}>
                <div 
                  className="user-icon-container" 
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} 
                  onClick={handleUserIconClick}
                >
                  {isAuthenticated ? (
                    // Show user avatar/icon when logged in
                    getUserAvatar() ? (
                      <img 
                        src={getUserAvatar() as string} 
                        alt="user avatar" 
                        style={{ width: 28, height: 28, borderRadius: '50%' }}
                      />
                    ) : (
                      <i className="fas fa-user" style={{ color: 'white' }} />
                    )
                  ) : (
                    // Show login text when not authenticated
                    <span style={{ color: 'white', fontWeight: 'bold' }}>Đăng Nhập</span>
                  )}
                </div>
                
                {isAuthenticated && (
                  <div 
                    id="user-dropdown" 
                    className="user-dropdown" 
                    style={{ 
                      display: isMenuOpen ? 'block' : 'none',
                      position: 'absolute',
                      backgroundColor: 'white',
                      minWidth: isEditingProfile ? '320px' : '200px',
                      boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                      zIndex: 1,
                      right: 0,
                      borderRadius: '8px',
                      marginTop: '10px',
                      padding: '10px 0'
                    }}
                  >
                    {!isEditingProfile ? (
                      <>
                        <div style={{ padding: '10px 16px', borderBottom: '1px solid #eee', marginBottom: '5px' }}>
                          <div style={{ fontWeight: 'bold' }}>{user?.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{user?.email}</div>
                          {user?.phone && (
                            <div style={{ fontSize: '12px', color: '#666' }}>📞 {user.phone}</div>
                          )}
                        </div>
                        <div 
                          onClick={handleEditProfile}
                          style={{ 
                            color: '#333',
                            padding: '12px 16px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fas fa-edit" style={{ marginRight: '10px' }}></i>
                          Sửa thông tin người dùng
                        </div>
                        <Link to="/my-bookings" style={{ 
                          color: '#333',
                          padding: '12px 16px',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          textAlign: 'left'
                        }}>
                          <i className="fas fa-calendar-check" style={{ marginRight: '10px' }}></i>
                          Phòng đã đặt
                        </Link>
                        <div 
                          onClick={handleLogout}
                          style={{ 
                            color: '#d32f2f',
                            padding: '12px 16px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fas fa-sign-out-alt" style={{ marginRight: '10px' }}></i>
                          Đăng xuất
                        </div>
                      </>
                    ) : (
                      <div style={{ padding: '0 16px' }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '15px',
                          paddingBottom: '10px',
                          borderBottom: '1px solid #eee'
                        }}>
                          <h4 style={{ margin: 0, fontSize: '16px' }}>Sửa thông tin</h4>
                          <button 
                            onClick={handleCancelEdit}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              fontSize: '18px', 
                              cursor: 'pointer',
                              color: '#666'
                            }}
                          >
                            ×
                          </button>
                        </div>

                        {editError && (
                          <div style={{ 
                            background: '#ffebee', 
                            color: '#d32f2f', 
                            padding: '8px', 
                            borderRadius: '4px', 
                            marginBottom: '10px',
                            fontSize: '12px'
                          }}>
                            {editError}
                          </div>
                        )}

                        {editSuccess && (
                          <div style={{ 
                            background: '#e8f5e9', 
                            color: '#2e7d32', 
                            padding: '8px', 
                            borderRadius: '4px', 
                            marginBottom: '10px',
                            fontSize: '12px'
                          }}>
                            {editSuccess}
                          </div>
                        )}

                        <form onSubmit={handleSaveProfile}>
                          <div style={{ marginBottom: '10px' }}>
                            <label style={{ 
                              display: 'block', 
                              marginBottom: '4px', 
                              fontSize: '12px', 
                              fontWeight: 'bold' 
                            }}>
                              Họ và tên:
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                              }}
                              required
                            />
                          </div>

                          <div style={{ marginBottom: '10px' }}>
                            <label style={{ 
                              display: 'block', 
                              marginBottom: '4px', 
                              fontSize: '12px', 
                              fontWeight: 'bold' 
                            }}>
                              Số điện thoại:
                            </label>
                            <input
                              type="tel"
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              pattern="[0-9]{10,11}"
                              style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                              }}
                              required
                            />
                          </div>

                          <div style={{ marginBottom: '10px' }}>
                            <label style={{ 
                              display: 'block', 
                              marginBottom: '4px', 
                              fontSize: '12px', 
                              fontWeight: 'bold' 
                            }}>
                              Email:
                            </label>
                            <input
                              type="email"
                              value={user?.email || ''}
                              disabled
                              style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                backgroundColor: '#f5f5f5',
                                color: '#666'
                              }}
                            />
                            <small style={{ color: '#666', fontSize: '10px' }}>
                              Email không thể thay đổi
                            </small>
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            marginTop: '15px' 
                          }}>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              style={{
                                flex: 1,
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: '#f5f5f5',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Hủy
                            </button>
                            <button
                              type="submit"
                              disabled={editLoading}
                              style={{
                                flex: 1,
                                padding: '8px',
                                border: 'none',
                                borderRadius: '4px',
                                backgroundColor: editLoading ? '#ccc' : '#7a5429',
                                color: 'white',
                                cursor: editLoading ? 'not-allowed' : 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              {editLoading ? 'Đang lưu...' : 'Lưu'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* <div className="col-xl-2 col-lg-2 d-none d-lg-block">
                <Link to="/contact" className="top-btn mt-10 mb-10">reservation </Link>
              </div> */}
              <div className="col-12">
                <div className="mobile-menu" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Modal */}
      <UserModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        position={userIconPosition}
      />
      
      <style>{`
        .user-dropdown.show {
          display: block !important;
        }
      `}</style>
    </header>
  )
}

export default Header