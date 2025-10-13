import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import BreadcrumbArea from "../../components/breadcrumb-area"
import api from "../../services/api"

interface RoomImage {
  imageId?: number;
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
}

interface Room {
  roomId?: number;
  id?: number;
  roomNumber?: string;
  roomTypeName?: string;
  price?: number;
  priceAsDouble?: number;
  capacity?: number;
  description?: string;
  images?: RoomImage[];
  roomDetail?: {
    roomSize?: string;
    bedType?: string;
    wifiSpeed?: string;
    airConditioning?: boolean;
    minibar?: boolean;
    balcony?: boolean;
    oceanView?: boolean;
    petFriendly?: boolean;
    smokingAllowed?: boolean;
  };
}

const RoomDetail = () => {
  const { id } = useParams()
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Prefer CRUD room detail if available
        const res = await api.get(`/rooms/${id}`)
        setRoom(res.data?.room || res.data)
      } catch (e: any) {
        try {
          // Fallback to booking controller detail
          const res2 = await api.get(`/bookings/rooms/${id}`)
          setRoom(res2.data?.room || res2.data)
        } catch (err: any) {
          setError('Không thể tải chi tiết phòng')
        }
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchDetail()
  }, [id])

  // Get all images or create fallback
  const allImages = room?.images && room.images.length > 0 
    ? room.images 
    : [{ imageUrl: '/src/assets/img/gallery/room-img01.png', altText: 'Room Image' }]
  
  const currentImage = allImages[selectedImageIndex] || allImages[0]
  
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
  }
  
  const handlePreviousImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? allImages.length - 1 : prev - 1
    )
  }
  
  const handleNextImage = () => {
    setSelectedImageIndex(prev => 
      prev === allImages.length - 1 ? 0 : prev + 1
    )
  }

  // Keyboard navigation for image gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (allImages.length <= 1) return
      
      if (e.key === 'ArrowLeft') {
        handlePreviousImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [allImages.length])

  if (loading) return <div style={{ padding: 24, textAlign: 'center' }}>Đang tải chi tiết phòng...</div>
  if (error) return <div style={{ padding: 24, textAlign: 'center', color: '#b91c1c' }}>{error}</div>
  if (!room) return null

  const priceText = (room.price?.toLocaleString?.() || room.price || room.priceAsDouble)?.toString()

  return (
    <>
      <BreadcrumbArea title={`Số phòng ${room.roomNumber || room.roomTypeName || ''}`} tag="Room Details" />
      <div className="about-area5 about-p p-relative">
        <div className="container pt-120 pb-40">
          <div className="row">
            {/* #right side */}
            <div className="col-sm-12 col-md-12 col-lg-4 order-2">
              <aside className="sidebar services-sidebar">
                <div className="sidebar-widget categories">
                  <div className="widget-content">
                    <h2 className="widget-title">  Book A Room</h2>
                    <div className="booking">
                      <div className="contact-bg">
                        <form className="contact-form mt-30" onSubmit={(e) => e.preventDefault()}>
                          <div className="row">
                            
                           
                            
                            <div className="col-lg-12">
                              <div className="slider-btn mt-15">
                              <div className="mb-50">
                    <a href={`/booking?roomId=${id}`} className="btn ss-btn">Book This Room</a>
                  </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="service-detail-contact wow fadeup-animation" data-wow-delay="1.1s">
                  <h3 className="h3-title">If You Need Any Help Contact With Us</h3>
                  <a href="tel:+917052101786" title="Call now">+91 705 2101 786</a>
                </div>
              </aside>
            </div>
            {/* #right side end */}
            <div className="col-lg-8 col-md-12 col-sm-12 order-1">
              <div className="service-detail">
                {/* Image Gallery */}
                <div className="room-gallery" style={{ marginBottom: '2rem' }}>
                  {/* Main Image */}
                  <div className="main-image-container" style={{ 
                    marginBottom: '1rem',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    position: 'relative'
                  }}>
                    <img 
                      src={currentImage.imageUrl} 
                      alt={currentImage.altText || `Room ${room.roomNumber}`}
                      style={{
                        width: '100%',
                        height: '400px',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease-in-out'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MDAgMjAwQzQwMCAxNzkuMDQ1IDQxNy4wNDUgMTYyIDQzOCAxNjJDNDU4Ljk1NSAxNjIgNDc2IDE3OS4wNDUgNDc2IDIwMEM0NzYgMjIwLjk1NSA0NTguOTU1IDIzOCA0MzggMjM4QzQxNy4wNDUgMjM4IDQwMCAyMjAuOTU1IDQwMCAyMDBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0zNTAgMjgwSDQ1MFYzMjBIMzUwVjI4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                    
                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          style={{
                            position: 'absolute',
                            left: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            transition: 'all 0.2s ease-in-out',
                            zIndex: 10
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                          }}
                        >
                          ‹
                        </button>
                        <button
                          onClick={handleNextImage}
                          style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            transition: 'all 0.2s ease-in-out',
                            zIndex: 10
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                          }}
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {allImages.length > 1 && (
                    <div className="thumbnail-gallery" style={{
                      display: 'flex',
                      gap: '0.75rem',
                      overflowX: 'auto',
                      padding: '0.5rem 0',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#cbd5e1 #f1f5f9'
                    }}>
                      {allImages.map((img, index) => (
                        <div
                          key={img.imageId || index}
                          onClick={() => handleImageClick(index)}
                          style={{
                            minWidth: '80px',
                            height: '80px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: selectedImageIndex === index ? '3px solid #644222' : '2px solid #e5e7eb',
                            transition: 'all 0.2s ease-in-out',
                            opacity: selectedImageIndex === index ? 1 : 0.7
                          }}
                          onMouseOver={(e) => {
                            if (selectedImageIndex !== index) {
                              e.currentTarget.style.opacity = '0.9';
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (selectedImageIndex !== index) {
                              e.currentTarget.style.opacity = '0.7';
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          <img 
                            src={img.imageUrl} 
                            alt={img.altText || `Thumbnail ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEM0MCAzNS41ODE3IDQzLjU4MTcgMzIgNDggMzJDNTIuNDE4MyAzMiA1NiAzNS41ODE3IDU2IDQwQzU2IDQ0LjQxODMgNTIuNDE4MyA0OCA0OCA0OEM0My41ODE3IDQ4IDQwIDQ0LjQxODMgNDAgNDBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0zNSA1NUg0NVY2NUgzNVY1NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                            }}
                          />
                    </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Image Counter */}
                  {allImages.length > 1 && (
                    <div style={{
                      textAlign: 'center',
                      marginTop: '0.5rem',
                      color: '#6b7280',
                      fontSize: '0.875rem'
                    }}>
                      {selectedImageIndex + 1} / {allImages.length}
                  </div>
                  )}
                </div>
                <div className="content-box">
                  <div className="row align-items-center mb-50">
                    <div className="col-lg-6 col-md-6">
                      <div className="price">
                        <h2>{`Số phòng ${room.roomNumber || ''}`}</h2>
                        {room.roomTypeName && (
                          <div style={{ color: '#64748b', marginTop: 6 }}>Loại phòng: {room.roomTypeName}</div>
                        )}
                        <span>{priceText} VNĐ/Night</span>
                      </div>
                    </div>
                    <div className="col-lg-6 text-right">
                      {/* rating/review placeholder */}
                    </div>
                  </div>
                  <p>{room.description || 'Không gian tiện nghi và sang trọng.'}</p>
                  <h3>Room Feature.</h3>
                  <ul className="room-features d-flex align-items-center" style={{ flexWrap: 'wrap' }}>
                    <li><i className="fal fa-users" /> Adults: {room.capacity || 2}</li>
                    {room.roomDetail?.roomSize && <li><i className="fal fa-square" /> Size: {room.roomDetail.roomSize}m²</li>}
                    {room.roomDetail?.bedType && <li><i className="fal fa-bed" /> Bed Type: {room.roomDetail.bedType}</li>}
                    {room.roomDetail?.wifiSpeed && <li><i className="fal fa-wifi" /> Wi‑Fi: {room.roomDetail.wifiSpeed}</li>}
                    {room.roomDetail?.airConditioning && <li><i className="fal fa-air-conditioner" /> Air Condition</li>}
                    {room.roomDetail?.minibar && <li><i className="fal fa-glass-cheers" /> Minibar</li>}
                    {room.roomDetail?.balcony && <li><i className="fal fa-umbrella-beach" /> Balcony</li>}
                    {room.roomDetail?.oceanView && <li><i className="fal fa-water" /> Ocean View</li>}
                    {room.roomDetail?.petFriendly && <li><i className="fal fa-paw" /> Pet Friendly</li>}
                    {room.roomDetail?.smokingAllowed && <li><i className="fal fa-smoking" /> Smoking</li>}
                  </ul>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RoomDetail