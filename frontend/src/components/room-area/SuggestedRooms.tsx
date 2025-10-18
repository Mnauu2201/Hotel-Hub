import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import fallbackRoomImg from '../../assets/img/gallery/room-img01.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWifi, 
  faSnowflake, 
  faWineBottle, 
  faUmbrellaBeach, 
  faWater, 
  faPaw, 
  faSmokingBan, 
  faCheckCircle,
  faShieldAlt,
  faConciergeBell,
  faDumbbell,
  faTv,
  faSwimmingPool,
  faSpa,
  faUtensils,
  faParking,
  faTshirt,
  faBriefcase,
  faCoffee,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

interface SuggestedRoomsProps {
  currentRoomId?: number;
  limit?: number;
}

const SuggestedRooms = ({ currentRoomId, limit = 3 }: SuggestedRoomsProps) => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<any[]>([])
  const [allRooms, setAllRooms] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  useEffect(() => {
    const fetchSuggestedRooms = async () => {
      try {
        // Lấy tất cả phòng available để có thể pagination
        const params = new URLSearchParams()
        if (currentRoomId) {
          params.append('excludeRoomId', currentRoomId.toString())
        }
        // Lấy nhiều phòng hơn để có thể pagination
        params.append('limit', '20')
        
        const res = await api.get(`/rooms/suggested?${params.toString()}`)
        const roomsData = res.data?.rooms || []
        
        setAllRooms(roomsData)
        setTotalPages(Math.ceil(roomsData.length / limit))
        
        // Hiển thị trang đầu tiên
        const firstPageRooms = roomsData.slice(0, limit)
        setRooms(firstPageRooms)
      } catch (e: any) {
        setError('Không thể tải danh sách phòng gợi ý')
      } finally {
        setLoading(false)
      }
    }
    fetchSuggestedRooms()
  }, [currentRoomId, limit])

  // Hàm xử lý chuyển trang với hiệu ứng
  const handlePageChange = (direction: 'prev' | 'next') => {
    if (isTransitioning) return
    
    if (direction === 'prev' && currentPage > 0) {
      setIsTransitioning(true)
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      const startIndex = newPage * limit
      const endIndex = startIndex + limit
      setRooms(allRooms.slice(startIndex, endIndex))
      
      // Reset transition state sau 300ms
      setTimeout(() => setIsTransitioning(false), 300)
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setIsTransitioning(true)
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      const startIndex = newPage * limit
      const endIndex = startIndex + limit
      setRooms(allRooms.slice(startIndex, endIndex))
      
      // Reset transition state sau 300ms
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }

  if (loading) {
    return (
      <section className="services-area pt-80 pb-80">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-12">
              <div className="section-title center-align mb-50 text-center">
                <h5>Gợi ý cho bạn</h5>
                <h2>Phòng tương tự</h2>
                <p>Đang tải các phòng gợi ý...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || rooms.length === 0) {
    return null
  }

  return (
    <section className="services-area pt-80 pb-80">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-12">
            <div className="section-title center-align mb-50 text-center">
              <h5>Gợi ý cho bạn</h5>
              <h2>Phòng tương tự</h2>
              <p>Khám phá thêm các phòng khác với tiện nghi tương tự để có thêm lựa chọn cho chuyến đi của bạn.</p>
            </div>
          </div>
        </div>
        {/* Navigation Controls */}
        {totalPages > 1 && (
          <div className="row mb-30">
            <div className="col-12">
              <div className="navigation-controls" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 0 || isTransitioning}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: '2px solid #644222',
                    backgroundColor: currentPage === 0 ? '#f5f5f5' : '#644222',
                    color: currentPage === 0 ? '#999' : 'white',
                    cursor: (currentPage === 0 || isTransitioning) ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    opacity: (currentPage === 0 || isTransitioning) ? 0.5 : 1,
                    boxShadow: '0 2px 8px rgba(100, 66, 34, 0.2)'
                  }}
                  onMouseOver={(e) => {
                    if (currentPage > 0 && !isTransitioning) {
                      e.currentTarget.style.backgroundColor = '#4a2f1a'
                      e.currentTarget.style.transform = 'scale(1.1)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(100, 66, 34, 0.3)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (currentPage > 0 && !isTransitioning) {
                      e.currentTarget.style.backgroundColor = '#644222'
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(100, 66, 34, 0.2)'
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '16px',
                  color: '#644222',
                  fontWeight: '500'
                }}>
                  <span>Trang {currentPage + 1} / {totalPages}</span>
                </div>
                
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === totalPages - 1 || isTransitioning}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: '2px solid #644222',
                    backgroundColor: currentPage === totalPages - 1 ? '#f5f5f5' : '#644222',
                    color: currentPage === totalPages - 1 ? '#999' : 'white',
                    cursor: (currentPage === totalPages - 1 || isTransitioning) ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    opacity: (currentPage === totalPages - 1 || isTransitioning) ? 0.5 : 1,
                    boxShadow: '0 2px 8px rgba(100, 66, 34, 0.2)'
                  }}
                  onMouseOver={(e) => {
                    if (currentPage < totalPages - 1 && !isTransitioning) {
                      e.currentTarget.style.backgroundColor = '#4a2f1a'
                      e.currentTarget.style.transform = 'scale(1.1)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(100, 66, 34, 0.3)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (currentPage < totalPages - 1 && !isTransitioning) {
                      e.currentTarget.style.backgroundColor = '#644222'
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(100, 66, 34, 0.2)'
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div 
          className="row" 
          style={{ 
            rowGap: 24,
            opacity: isTransitioning ? 0.7 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          {rooms.map((room) => {
            const primaryImg = room.images?.find((i: any) => i.isPrimary)?.imageUrl || room.images?.[0]?.imageUrl
            const priceText = (room.price?.toLocaleString?.() || room.price || room.priceAsDouble)?.toString()
            
            // Xử lý URL hình ảnh
            let imageUrl = primaryImg || fallbackRoomImg
            if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('http')) {
              if (imageUrl.startsWith('/uploads/')) {
                imageUrl = 'http://localhost:8080' + imageUrl
              } else if (!imageUrl.startsWith('/')) {
                imageUrl = 'http://localhost:8080/uploads/' + imageUrl
              } else {
                imageUrl = 'http://localhost:8080' + imageUrl
              }
            }
            
            return (
              <div key={room.roomId} className="col-xl-4 col-md-6" style={{ display: 'flex', paddingLeft: 12, paddingRight: 12 }}>
                <div className="single-services mb-30" style={{ height: '100%', minHeight: 560, display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <div className="services-thumb" style={{ width: '100%' }}>
                    <Link className="gallery-link popup-image" to={`/room-detail/${room.roomId}`}>
                      <img 
                        src={imageUrl} 
                        alt={room.roomTypeName || 'room'} 
                        style={{ width: '100%', height: 260, objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = fallbackRoomImg
                        }}
                      />
                    </Link>
                  </div>
                  <div className="services-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="day-book">
                      <ul>
                        <li>{priceText} VNĐ/Đêm</li>
                        <li>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              navigate('/booking', { state: { room } })
                            }}
                          >
                            Đặt ngay
                          </a>
                        </li>
                      </ul>
                    </div>
                    <h4 style={{ marginTop: 10 }}>
                      <Link to={`/room-detail/${room.roomId}`}>
                        {`Số phòng ${room.roomNumber || ''}`}
                      </Link>
                    </h4>
                    {room.roomTypeName && (
                      <div style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>
                        Loại phòng: {room.roomTypeName}
                      </div>
                    )}
                    <p style={{ marginBottom: 'auto' }}>
                      {room.description || 'Trải nghiệm không gian sang trọng và tiện nghi.'}
                    </p>
                    {room.roomDetail && (
                      <ul style={{ marginTop: 8 }}>
                        {room.roomDetail.bedType && <li>Giường: {room.roomDetail.bedType}</li>}
                        {room.roomDetail.roomSize && <li>Diện tích: {room.roomDetail.roomSize} m²</li>}
                        {room.roomDetail.viewType && <li>Tầm nhìn: {room.roomDetail.viewType}</li>}
                      </ul>
                    )}
                    <div className="icon" style={{ marginTop: 'auto' }}>
                      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
                        {/* Room Details Amenities */}
                        {room.roomDetail?.wifiSpeed && (
                          <li title={`Wi‑Fi ${room.roomDetail.wifiSpeed}`} style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            transition: 'all 0.2s ease'
                          }}>
                            <FontAwesomeIcon icon={faWifi} style={{ fontSize: '16px', color: '#644222' }} />
                          </li>
                        )}
                        {room.roomDetail?.airConditioning && (
                          <li title="Điều hòa" style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            transition: 'all 0.2s ease'
                          }}>
                            <FontAwesomeIcon icon={faSnowflake} style={{ fontSize: '16px', color: '#644222' }} />
                          </li>
                        )}
                        {room.roomDetail?.minibar && (
                          <li title="Minibar" style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            transition: 'all 0.2s ease'
                          }}>
                            <FontAwesomeIcon icon={faWineBottle} style={{ fontSize: '16px', color: '#644222' }} />
                          </li>
                        )}
                        {room.roomDetail?.balcony && (
                          <li title="Ban công" style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            transition: 'all 0.2s ease'
                          }}>
                            <FontAwesomeIcon icon={faUmbrellaBeach} style={{ fontSize: '16px', color: '#644222' }} />
                          </li>
                        )}
                        {room.roomDetail?.oceanView && (
                          <li title="Hướng biển" style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            transition: 'all 0.2s ease'
                          }}>
                            <FontAwesomeIcon icon={faWater} style={{ fontSize: '16px', color: '#644222' }} />
                          </li>
                        )}
                        {room.roomDetail?.petFriendly && (
                          <li title="Thân thiện thú cưng" style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            transition: 'all 0.2s ease'
                          }}>
                            <FontAwesomeIcon icon={faPaw} style={{ fontSize: '16px', color: '#644222' }} />
                          </li>
                        )}
                        {room.roomDetail?.smokingAllowed && (
                          <li title="Cho hút thuốc" style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            transition: 'all 0.2s ease'
                          }}>
                            <FontAwesomeIcon icon={faSmokingBan} style={{ fontSize: '16px', color: '#644222' }} />
                          </li>
                        )}

                        {/* Additional Amenities from Database */}
                        {Array.isArray(room.amenities) && room.amenities.slice(0, 6).map((amenity: any) => {
                          // Function to get appropriate icon based on amenity name
                          const getAmenityIcon = (name: string) => {
                            const lowerName = (name || '').toLowerCase();
                            if (lowerName.includes('wifi') || lowerName.includes('internet')) return faWifi;
                            if (lowerName.includes('tv') || lowerName.includes('television')) return faTv;
                            if (lowerName.includes('air') || lowerName.includes('conditioning') || lowerName.includes('điều hòa')) return faSnowflake;
                            if (lowerName.includes('safe') || lowerName.includes('security')) return faShieldAlt;
                            if (lowerName.includes('minibar') || lowerName.includes('mini bar')) return faWineBottle;
                            if (lowerName.includes('balcony') || lowerName.includes('terrace') || lowerName.includes('ban công')) return faUmbrellaBeach;
                            if (lowerName.includes('ocean') || lowerName.includes('sea') || lowerName.includes('view') || lowerName.includes('biển')) return faWater;
                            if (lowerName.includes('pet') || lowerName.includes('animal') || lowerName.includes('thú cưng')) return faPaw;
                            if (lowerName.includes('room service') || lowerName.includes('service')) return faConciergeBell;
                            if (lowerName.includes('gym') || lowerName.includes('fitness') || lowerName.includes('exercise')) return faDumbbell;
                            if (lowerName.includes('pool') || lowerName.includes('swimming')) return faSwimmingPool;
                            if (lowerName.includes('spa') || lowerName.includes('wellness')) return faSpa;
                            if (lowerName.includes('restaurant') || lowerName.includes('dining')) return faUtensils;
                            if (lowerName.includes('parking') || lowerName.includes('car')) return faParking;
                            if (lowerName.includes('laundry') || lowerName.includes('cleaning')) return faTshirt;
                            if (lowerName.includes('business') || lowerName.includes('office')) return faBriefcase;
                            if (lowerName.includes('concierge') || lowerName.includes('assistance')) return faConciergeBell;
                            if (lowerName.includes('breakfast') || lowerName.includes('meal')) return faCoffee;
                            if (lowerName.includes('housekeeping') || lowerName.includes('cleaning')) return faTshirt;
                            if (lowerName.includes('smoking') || lowerName.includes('hút thuốc')) return faSmokingBan;
                            return faCheckCircle; // Default icon
                          };

                          return (
                            <li 
                              key={amenity.amenityId || amenity.name} 
                              title={amenity.name}
                              style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px',
                                border: '1px solid #e9ecef',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#644222';
                                e.currentTarget.style.color = 'white';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.color = '#644222';
                              }}
                            >
                              <FontAwesomeIcon 
                                icon={getAmenityIcon(amenity.name)} 
                                style={{ 
                                  fontSize: '16px',
                                  color: '#644222'
                                }} 
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SuggestedRooms
