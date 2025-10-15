import { Link, useNavigate } from 'react-router-dom'
import sveIcon1 from '../../assets/img/icon/sve-icon1.png'
import sveIcon2 from '../../assets/img/icon/sve-icon2.png'
import sveIcon3 from '../../assets/img/icon/sve-icon3.png'
import sveIcon4 from '../../assets/img/icon/sve-icon4.png'
import sveIcon5 from '../../assets/img/icon/sve-icon5.png'
import sveIcon6 from '../../assets/img/icon/sve-icon6.png'

import { useEffect, useState } from 'react'
import api from '../../services/api'
import fallbackRoomImg from '../../assets/img/gallery/room-img01.png'
// Import tất cả hình ảnh phòng có sẵn
import roomImg01 from '../../assets/img/gallery/room-img01.png'
import roomImg02 from '../../assets/img/gallery/room-img02.png'
import roomImg03 from '../../assets/img/gallery/room-img03.png'
import roomImg04 from '../../assets/img/gallery/room-img04.png'
import roomImg05 from '../../assets/img/gallery/room-img05.png'
import roomImg06 from '../../assets/img/gallery/room-img06.png'

const RoomArea2 = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<any[]>([])
  const [filteredRooms, setFilteredRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [roomTypes, setRoomTypes] = useState<string[]>([])

  // Mảng chứa tất cả hình ảnh phòng
  const roomImages = [
    roomImg01, roomImg02, roomImg03, roomImg04, roomImg05, roomImg06
  ];

  // Chọn hình ảnh fallback dựa trên số phòng hoặc ID phòng
  const getFallbackImage = (room) => {
    // Ưu tiên dựa trên số phòng
    const roomNumber = room.roomNumber || room.room_number;
    if (roomNumber) {
      // Lấy số cuối của phòng để chọn hình ảnh
      const lastDigit = parseInt(roomNumber.toString().slice(-1));
      return roomImages[lastDigit % roomImages.length];
    }
    
    // Fallback dựa trên ID phòng
    const roomId = room.roomId || room.id;
    if (roomId) {
      const idNumber = parseInt(roomId.toString().slice(-1));
      return roomImages[idNumber % roomImages.length];
    }
    
    // Fallback dựa trên loại phòng
    const roomType = (room.roomTypeName || room.roomType?.name || '').toLowerCase();
    if (roomType.includes('single') || roomType.includes('đơn')) return roomImg01;
    if (roomType.includes('double') || roomType.includes('đôi')) return roomImg02;
    if (roomType.includes('suite') || roomType.includes('sang trọng')) return roomImg03;
    
    return fallbackRoomImg;
  };

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
            const finalImage = primaryImg || getFallbackImage(room)
            const priceText = (room.price?.toLocaleString?.() || room.price || room.priceAsDouble)?.toString()
            return (
              <div key={room.roomId} className="col-xl-4 col-md-6" style={{ display: 'flex', paddingLeft: 12, paddingRight: 12 }}>
                <div className="single-services ser-m mb-30" style={{ height: '100%', minHeight: 520, display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <div className="services-thumb" style={{ width: '100%' }}>
                    <Link className="gallery-link popup-image" to={`/room-detail/${room.roomId}`}>
                      <img 
                        src={finalImage} 
                        alt={room.roomTypeName || 'room'} 
                        style={{ width: '100%', height: 240, objectFit: 'cover' }} 
                        onError={(e) => {
                          e.target.src = getFallbackImage(room);
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
                      <ul>
                        {room.roomDetail?.wifiSpeed && (
                          <li title={`Wi‑Fi ${room.roomDetail.wifiSpeed}`}><img src={sveIcon3} alt="wifi" /></li>
                        )}
                        {room.roomDetail?.airConditioning && (
                          <li title="Điều hòa"><img src={sveIcon4} alt="air" /></li>
                        )}
                        {room.roomDetail?.minibar && (
                          <li title="Minibar"><img src={sveIcon5} alt="minibar" /></li>
                        )}
                        {room.roomDetail?.balcony && (
                          <li title="Ban công"><img src={sveIcon2} alt="balcony" /></li>
                        )}
                        {room.roomDetail?.oceanView && (
                          <li title="Hướng biển"><img src={sveIcon6} alt="ocean" /></li>
                        )}
                        {room.roomDetail?.petFriendly && (
                          <li title="Thân thiện thú cưng"><img src={sveIcon1} alt="pet" /></li>
                        )}
                        {room.roomDetail?.smokingAllowed && (
                          <li title="Cho hút thuốc"><img src={sveIcon4} alt="smoking" /></li>
                        )}
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