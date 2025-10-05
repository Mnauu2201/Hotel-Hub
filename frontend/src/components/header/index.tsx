import { Link } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../assets/img/logo/logo.png'
import UserModal from '../user/UserModal'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                    <span>Mon - Fri: 9:00 - 19:00/ Closed on Weekends</span>
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
                        <Link to="/">Home</Link>
                      </li>
                      <li><Link to="/about">About</Link></li>
                      <li className="has-sub">
                        <Link to="/room">our rooms</Link>
                        
                      </li>
                      <li className="has-sub">
                        <Link to="/services">Service</Link>
                        
                      </li>
                      <li className="has-sub"><Link to="#">Pages</Link>
                        <ul>
                          {/* <li><Link to="/gallery">Gallery</Link></li> */}
                          <li><Link to="/faq">Faq</Link></li>
                          <li><Link to="/team">Team</Link></li>
                          <li><Link to="/pricing">Pricing</Link></li>
                          {/* <li><Link to="/shop">Shop</Link></li> */}
                          {/* <li><Link to="/shop-details">Shop Details</Link></li> */}
                        </ul>
                      </li>
                      <li className="has-sub">
                        <Link to="/blog">Blog</Link>
                       
                      </li>
                      <li><Link to="/contact">Contact</Link></li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 d-none d-lg-block" style={{ position: 'relative' }}>
                <div 
                  className="user-icon-container" 
                  style={{ cursor: 'pointer' }} 
                  onClick={handleUserIconClick}
                >
                  {isAuthenticated && user?.name ? (
                    <div className="user-name-display" style={{ color: 'white', fontWeight: 'bold' }}>
                      {user?.name}
                    </div>
                  ) : (
                    <i className="fas fa-user" style={{ color: 'white' }} />
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
                      minWidth: '200px',
                      boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                      zIndex: 1,
                      right: 0,
                      borderRadius: '8px',
                      marginTop: '10px',
                      padding: '10px 0'
                    }}
                  >
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid #eee', marginBottom: '5px' }}>
                      <div style={{ fontWeight: 'bold' }}>{user?.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{user?.email}</div>
                    </div>
                    <Link to="/profile" style={{ 
                      color: '#333',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'left'
                    }}>
                      <i className="fas fa-user-edit" style={{ marginRight: '10px' }}></i>
                      Sửa thông tin cá nhân
                    </Link>
                    <Link to="#" onClick={handleLogout} style={{ 
                      color: '#d32f2f',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'left'
                    }}>
                      <i className="fas fa-sign-out-alt" style={{ marginRight: '10px' }}></i>
                      Đăng xuất
                    </Link>
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