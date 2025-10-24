import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import { useNotification } from '../../hooks/useNotification';

interface Room {
  roomId?: number;
  id?: number;
  roomNumber?: string;
  roomTypeName?: string;
  roomType?: {
    name?: string;
    price?: number;
    capacity?: number;
  };
  capacity?: number;
  price?: number;
  images?: Array<{ imageUrl?: string }>;
  roomDetail?: {
    bedType?: string;
    roomSize?: string;
    viewType?: string;
  };
}

interface FormData {
  checkIn: string;
  checkOut: string;
  guests: string;
}

interface Errors {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

const BookingArea = () => {
  const navigate = useNavigate();
  const { showError, NotificationContainer } = useNotification();
  const [formData, setFormData] = useState<FormData>({
    checkIn: '',
    checkOut: '',
    guests: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 3;

  const today = new Date().toISOString().split('T')[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    // Validate check-in date
    if (!formData.checkIn) {
      newErrors.checkIn = 'Vui lòng chọn ngày nhận phòng';
    } else if (formData.checkIn < today) {
      newErrors.checkIn = 'Ngày nhận phòng không được trước ngày hôm nay';
    }

    // Validate check-out date
    if (!formData.checkOut) {
      newErrors.checkOut = 'Vui lòng chọn ngày trả phòng';
    } else if (formData.checkOut <= formData.checkIn) {
      newErrors.checkOut = 'Ngày trả phòng phải sau ngày nhận phòng';
    }

    // Validate guests
    if (!formData.guests || formData.guests === 'sports-massage') {
      newErrors.guests = 'Vui lòng chọn số lượng khách';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Fetch available rooms
      const availableRooms = await bookingService.getAvailableRooms(formData.checkIn, formData.checkOut);
      
      // Filter rooms by guest capacity if specified
      let filteredRooms = availableRooms as Room[];
      if (formData.guests) {
        filteredRooms = availableRooms.filter((room: any) => 
          room.capacity >= parseInt(formData.guests)
        ) as Room[];
      }
      
      setSearchResults(filteredRooms);
      setShowResults(true);
      setCurrentPage(1); // Reset to first page when new search
    } catch (error) {
      console.error('Error checking availability:', error);
      showError('Có lỗi xảy ra khi kiểm tra phòng trống. Vui lòng thử lại.');
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookRoom = (room: Room) => {
    // Store search criteria in localStorage for the booking page
    localStorage.setItem('searchCriteria', JSON.stringify({
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: parseInt(formData.guests)
    }));

    // Navigate to booking page with room and search criteria
    navigate('/booking', { 
      state: { 
        room,
        searchCriteria: {
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: parseInt(formData.guests)
        }
      }
    });
  };

  const handleViewRoomDetail = (room: Room) => {
    // Navigate to room detail page
    navigate(`/room-detail/${room.roomId || room.id}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(searchResults.length / roomsPerPage);
  const startIndex = (currentPage - 1) * roomsPerPage;
  const endIndex = startIndex + roomsPerPage;
  const currentRooms = searchResults.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    const resultsElement = document.getElementById('search-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="booking" className="booking-area p-relative">
      <div className="container">
        <form onSubmit={handleCheckAvailability} className="contact-form">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <ul>
                <li>
                  <div className="contact-field p-relative c-name">
                    <label><i className="fal fa-badge-check" /> Ngày nhận phòng</label>
                    <input 
                      type="date" 
                      id="checkin" 
                      name="checkIn" 
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      min={today}
                    />
                    {errors.checkIn && <div style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.checkIn}</div>}
                  </div>
                </li>
                <li>
                  <div className="contact-field p-relative c-name">
                    <label><i className="fal fa-times-octagon" /> Ngày trả phòng</label>
                    <input 
                      type="date" 
                      id="checkout" 
                      name="checkOut" 
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      min={formData.checkIn ? new Date(new Date(formData.checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : today}
                    />
                    {errors.checkOut && <div style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.checkOut}</div>}
                  </div>
                </li>
                <li>
                  <div className="contact-field p-relative c-name">
                    <label><i className="fal fa-users" /> Số lượng khách</label>
                    <select name="guests" id="guests" value={formData.guests} onChange={handleInputChange}>
                      <option value="sports-massage">Số lượng khách</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                    {errors.guests && <div style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.guests}</div>}
                  </div>
                </li>
                <li>
                  <div className="slider-btn">
                    <label><i className="fal fa-calendar-alt" /></label>
                    <button 
                      type="submit"
                      className="btn ss-btn" 
                      data-animation="fadeInRight" 
                      data-delay=".8s"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Đang kiểm tra...' : 'Check Availability'}
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </form>
        
        {/* Search Results */}
        {showResults && (
          <div id="search-results" style={{ marginTop: '2rem' }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '1.5rem',
              padding: '1.5rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '0.5rem',
              border: '1px solid #0ea5e9'
            }}>
              <h3 style={{ color: '#0369a1', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                🔍 Kết quả tìm kiếm phòng trống
              </h3>
              <p style={{ color: '#0369a1', margin: 0, fontSize: '1.1rem' }}>
                Tìm thấy <strong>{searchResults.length}</strong> phòng phù hợp với tiêu chí của bạn
              </p>
              
            </div>

            {searchResults.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                backgroundColor: '#fef3c7', 
                borderRadius: '0.5rem',
                border: '1px solid #f59e0b'
              }}>
                <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>Không tìm thấy phòng phù hợp</h3>
                <p style={{ color: '#92400e', marginBottom: '1.5rem' }}>
                  Không có phòng trống phù hợp với tiêu chí tìm kiếm của bạn. 
                  Vui lòng thử lại với ngày khác hoặc số lượng khách khác.
                </p>
                <button 
                  onClick={() => setShowResults(false)}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Tìm kiếm lại
                </button>
              </div>
            ) : (
              <>
                {/* Rooms Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                  gap: '2rem',
                  padding: '1rem 0'
                }}>
                  {currentRooms.map(room => (
                    <div key={room.roomId || room.id} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: 'white',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleViewRoomDetail(room)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                    }}>
                      {/* Room Image */}
                      <div style={{
                        height: '200px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <img 
                          src={room.images?.[0]?.imageUrl || '/src/assets/img/gallery/room-img01.png'} 
                          alt={`Phòng ${room.roomNumber}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease-in-out'
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMyMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTAwQzE2MCA4OS41IDE2OC41IDgxIDE3OSA4MUMxODkuNSA4MSAxOTggODkuNSAxOTggMTAwQzE5OCAxMTAuNSAxODkuNSAxMTkgMTc5IDExOUMxNjguNSAxMTkgMTYwIDExMC41IDE2MCAxMDBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNDAgMTIwSDE4MFYxNDBIMTQwVjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: 'rgba(100, 66, 34, 0.9)',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          Phòng {room.roomNumber}
                        </div>
                      </div>
                      
                      {/* Room Info */}
                      <div style={{ padding: '1.5rem' }}>
                        <h4 style={{ 
                          margin: '0 0 1rem 0', 
                          color: '#644222',
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          lineHeight: '1.3'
                        }}>
                          {room.roomTypeName || room.roomType?.name || 'Phòng Deluxe'}
                        </h4>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '0.5rem',
                            color: '#6b7280',
                            fontSize: '0.95rem'
                          }}>
                            <span style={{ marginRight: '0.5rem' }}>👥</span>
                            <strong>Sức chứa:</strong> {room.capacity || room.roomType?.capacity || 0} khách
                          </div>
                          
                          {room.roomDetail?.bedType && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              marginBottom: '0.5rem',
                              color: '#6b7280',
                              fontSize: '0.95rem'
                            }}>
                              <span style={{ marginRight: '0.5rem' }}>🛏️</span>
                              <strong>Giường:</strong> {room.roomDetail.bedType}
                            </div>
                          )}
                          
                          {room.roomDetail?.roomSize && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              marginBottom: '0.5rem',
                              color: '#6b7280',
                              fontSize: '0.95rem'
                            }}>
                              <span style={{ marginRight: '0.5rem' }}>📐</span>
                              <strong>Diện tích:</strong> {room.roomDetail.roomSize}m²
                            </div>
                          )}
                          
                          {room.roomDetail?.viewType && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              marginBottom: '0.5rem',
                              color: '#6b7280',
                              fontSize: '0.95rem'
                            }}>
                              <span style={{ marginRight: '0.5rem' }}>🌅</span>
                              <strong>Tầm nhìn:</strong> {room.roomDetail.viewType}
                            </div>
                          )}
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginTop: '1.5rem',
                          paddingTop: '1rem',
                          borderTop: '1px solid #f3f4f6'
                        }}>
                          <div>
                            <span style={{ 
                              fontSize: '1.75rem', 
                              fontWeight: '800', 
                              color: '#8a643f' 
                            }}>
                              {(room.price || room.roomType?.price || 0).toLocaleString('vi-VN')}
                            </span>
                            <span style={{ 
                              fontSize: '1rem', 
                              color: '#6b7280',
                              marginLeft: '0.25rem'
                            }}>
                              VND/đêm
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookRoom(room);
                            }}
                            style={{
                              backgroundColor: '#644222',
                              color: 'white',
                              border: 'none',
                              padding: '0.875rem 1.75rem',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              fontWeight: '600',
                              transition: 'all 0.2s ease-in-out',
                              boxShadow: '0 4px 12px rgba(100, 66, 34, 0.3)'
                            }}
                            onMouseOver={(e) => {
                              const target = e.target as HTMLButtonElement;
                              target.style.backgroundColor = '#8a643f';
                              target.style.transform = 'translateY(-2px)';
                              target.style.boxShadow = '0 6px 16px rgba(100, 66, 34, 0.4)';
                            }}
                            onMouseOut={(e) => {
                              const target = e.target as HTMLButtonElement;
                              target.style.backgroundColor = '#644222';
                              target.style.transform = 'translateY(0)';
                              target.style.boxShadow = '0 4px 12px rgba(100, 66, 34, 0.3)';
                            }}
                          >
                            Đặt phòng
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '2rem',
                    gap: '0.5rem'
                  }}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: currentPage === 1 ? '#f9fafb' : 'white',
                        color: currentPage === 1 ? '#9ca3af' : '#374151',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      ← Trước
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          padding: '0.75rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          backgroundColor: currentPage === page ? '#644222' : 'white',
                          color: currentPage === page ? 'white' : '#374151',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          minWidth: '40px'
                        }}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white',
                        color: currentPage === totalPages ? '#9ca3af' : '#374151',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      <NotificationContainer />
    </div>
  )
}

export default BookingArea