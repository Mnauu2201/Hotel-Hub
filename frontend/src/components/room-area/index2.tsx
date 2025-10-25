import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import fallbackRoomImg from '../../assets/img/gallery/room-img01.png'

const RoomArea2 = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms')
        const roomsData = res.data?.rooms || []
        setRooms(roomsData)
      } catch (e: any) {
        setError('Không thể tải danh sách phòng')
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  const processImageUrl = (imageObj: any) => {
    if (!imageObj || !imageObj.imageUrl || typeof imageObj.imageUrl !== 'string') {
      return fallbackRoomImg
    }
    
    let url = imageObj.imageUrl
    if (url.startsWith('/uploads/')) {
      return 'http://localhost:8080' + url
    }
    return url
  }

  if (loading) {
    return (
      <section className="services-area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p style={{ textAlign: 'center' }}>Đang tải danh sách phòng...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="services-area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p style={{ textAlign: 'center', color: '#b91c1c' }}>{error}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="services-area pt-120 pb-90">
      <div className="container">
        <div className="row" style={{ rowGap: 24 }}>
          {rooms.length === 0 ? (
            <div className="col-12">
              <p style={{ textAlign: 'center' }}>Không có phòng nào.</p>
            </div>
          ) : (
            rooms.map((room: any) => {
              const firstImage = room.images && room.images.length > 0 ? room.images[0] : null
              const imageUrl = processImageUrl(firstImage)
              
              return (
                <div key={room.roomId} className="col-xl-4 col-md-6" style={{ display: 'flex', paddingLeft: 12, paddingRight: 12 }}>
                  <div className="single-services ser-m mb-30" style={{ height: '100%', minHeight: 520, display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div className="services-thumb" style={{ width: '100%' }}>
                      <Link className="gallery-link popup-image" to={`/room-detail/${room.roomId}`}>
                        <img 
                          src={imageUrl} 
                          alt={room.roomTypeName || 'room'} 
                          style={{ width: '100%', height: 240, objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = fallbackRoomImg
                          }}
                        />
                      </Link>
                    </div>
                    <div className="services-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <div className="day-book">
                        <ul>
                          <li>{room.price?.toLocaleString?.() || room.price || 0} VNĐ/Đêm</li>
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
                        {room.description || 'Không gian tiện nghi và sang trọng.'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

export default RoomArea2