import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
  faCoffee
} from '@fortawesome/free-solid-svg-icons'

const RoomArea2 = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<any[]>([])
  const [filteredRooms, setFilteredRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [roomTypes, setRoomTypes] = useState<string[]>([])

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms')
        const roomsData = res.data?.rooms || []
        setRooms(roomsData)
        setFilteredRooms(roomsData)
        
        // Lấy danh sách các loại phòng duy nhất
        const types = Array.from(new Set(roomsData.map((room: any) => room.roomTypeName))).filter(Boolean) as string[]
        setRoomTypes(types)
      } catch (e: any) {
        setError('Không thể tải danh sách phòng')
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])
  
  // Xử lý tìm kiếm và lọc
  useEffect(() => {
    if (!rooms.length) return
    
    let result = [...rooms]
    
    // Lọc theo từ khóa tìm kiếm (ID, status, tên phòng hoặc số phòng)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(room => 
        room.roomId?.toString().includes(term) || 
        room.roomNumber?.toLowerCase().includes(term) ||
        room.status?.toLowerCase().includes(term) ||
        room.roomTypeName?.toLowerCase().includes(term) ||
        (room.description && room.description.toLowerCase().includes(term))
      )
    }
    
    // Lọc theo loại phòng
    if (selectedType) {
      result = result.filter(room => room.roomTypeName === selectedType)
    }
    
    setFilteredRooms(result)
  }, [searchTerm, selectedType, rooms])

  // Xử lý reset tìm kiếm
  const handleResetSearch = () => {
    setSearchTerm('')
    setSelectedType('')
    setFilteredRooms(rooms)
  }

  return (
    <section id="services" className="services-area pt-120 pb-90">
      <div className="container">
        {/* Thanh tìm kiếm */}
        <div className="row mb-40">
          <div className="col-12">
            <div className="search-filter-box" style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <div className="row align-items-center">
                <div className="col-lg-5 col-md-6 mb-3 mb-md-0">
                  <div className="search-input">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Tìm theo ID, số phòng, tên phòng hoặc trạng thái..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: '12px 15px',
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 mb-3 mb-md-0">
                  <div className="d-flex flex-wrap" style={{ gap: '10px' }}>
                    <button 
                      className={`filter-btn ${selectedType === '' ? 'active' : ''}`}
                      onClick={handleResetSearch}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: selectedType === '' ? '#644222' : '#fff',
                        color: selectedType === '' ? '#fff' : '#333',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="fas fa-list-ul mr-2"></i> Tất cả
                    </button>
                    {roomTypes.map(type => (
                      <button 
                        key={type} 
                        className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                        onClick={() => setSelectedType(type)}
                        style={{
                          padding: '10px 15px',
                          backgroundColor: selectedType === type ? '#644222' : '#fff',
                          color: selectedType === type ? '#fff' : '#333',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="fas fa-bed mr-2"></i> {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-lg-2 text-end">
                  <div className="results-count">
                    <span style={{ fontWeight: 'bold' }}>{filteredRooms.length}</span> phòng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row" style={{ rowGap: 24 }}>
          {loading && (
            <div className="col-12"><p style={{ textAlign: 'center' }}>Đang tải danh sách phòng...</p></div>
          )}
          {!loading && error && (
            <div className="col-12"><p style={{ textAlign: 'center', color: '#b91c1c' }}>{error}</p></div>
          )}
          {!loading && !error && filteredRooms.length === 0 && (
            <div className="col-12">
              <p style={{ textAlign: 'center' }}>Không tìm thấy phòng nào phù hợp với tiêu chí tìm kiếm.</p>
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button 
                  onClick={handleResetSearch}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#644222',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Xem tất cả phòng
                </button>
              </div>
            </div>
          )}
          {!loading && !error && filteredRooms.map((room: any) => {
            const primaryImg = room.images?.find((i: any) => i.isPrimary)?.imageUrl || room.images?.[0]?.imageUrl
            const priceText = (room.price?.toLocaleString?.() || room.price || room.priceAsDouble)?.toString()
            return (
              <div key={room.roomId} className="col-xl-4 col-md-6" style={{ display: 'flex', paddingLeft: 12, paddingRight: 12 }}>
                <div className="single-services ser-m mb-30" style={{ height: '100%', minHeight: 520, display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <div className="services-thumb" style={{ width: '100%' }}>
                    <Link className="gallery-link popup-image" to={`/room-detail/${room.roomId}`}>
                      <img src={primaryImg || fallbackRoomImg} alt={room.roomTypeName || 'room'} style={{ width: '100%', height: 240, objectFit: 'cover' }} />
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
                    <h4 style={{ marginTop: 10 }}><Link to={`/room-detail/${room.roomId}`}>{`Số phòng ${room.roomNumber || ''}`}</Link></h4>
                    {room.roomTypeName && (
                      <div style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Loại phòng: {room.roomTypeName}</div>
                    )}
                    <p style={{ marginBottom: 'auto' }}>{room.description || 'Không gian tiện nghi và sang trọng.'}</p>
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

export default RoomArea2