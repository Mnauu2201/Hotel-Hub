import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import BreadcrumbArea from "../../components/breadcrumb-area"
import SuggestedRooms from "../../components/room-area/SuggestedRooms"
import api from "../../services/api"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUsers, 
  faExpandArrowsAlt, 
  faBed, 
  faLayerGroup, 
  faMountain, 
  faWifi, 
  faSnowflake, 
  faWineBottle, 
  faWater, 
  faPaw, 
  faSmokingBan, 
  faCheckCircle,
  faShieldAlt,
  faUmbrellaBeach,
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

interface RoomImage {
  imageId?: number;
  imageUrl: string;
  url?: string;
  altText?: string;
  isPrimary?: boolean;
}

interface Amenity {
  amenityId?: number;
  name: string;
  description?: string;
  icon?: string;
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
  amenities?: Amenity[];
  roomDetail?: {
    detailId?: number;
    roomSize?: number;
    bedType?: string;
    floor?: number;
    viewType?: string;
    smokingAllowed?: boolean;
    petFriendly?: boolean;
    wifiSpeed?: string;
    airConditioning?: boolean;
    minibar?: boolean;
    balcony?: boolean;
    oceanView?: boolean;
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
        console.log('Room detail response:', res.data)
        console.log('Room images from API:', res.data?.images || res.data?.room?.images)
        setRoom(res.data?.room || res.data)
      } catch (e: any) {
        try {
          // Fallback to booking controller detail
          const res2 = await api.get(`/bookings/rooms/${id}`)
          console.log('Room detail fallback response:', res2.data)
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
  console.log('Room object:', room);
  console.log('Room images:', room?.images);
  
  const allImages = room?.images && room.images.length > 0 
    ? room.images.map(img => {
        console.log('Processing image:', img);
        // Handle different image data structures
        if (typeof img === 'string') {
          return { imageUrl: img, altText: 'Room Image' };
        }
        let imageUrl: string = img.imageUrl || img.url || '';
        console.log('Original Image URL:', imageUrl);
        
        // Convert relative URLs to absolute backend URLs
        if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('http')) {
          if (imageUrl.startsWith('/uploads/')) {
            // If it's already a relative path starting with /uploads/, prepend backend URL
            imageUrl = 'http://localhost:8080' + imageUrl;
          } else if (!imageUrl.startsWith('/')) {
            // If it doesn't start with /, add /uploads/ prefix and backend URL
            imageUrl = 'http://localhost:8080/uploads/' + imageUrl;
          } else {
            // If it starts with / but not /uploads/, add backend URL
            imageUrl = 'http://localhost:8080' + imageUrl;
          }
        }
        
        console.log('Processed Image URL:', imageUrl);
        return {
          imageUrl: imageUrl,
          altText: img.altText || 'Room Image'
        };
      })
    : [{ imageUrl: '/src/assets/img/gallery/room-img01.png', altText: 'Room Image' }]
  
  console.log('Processed allImages:', allImages);
  
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
                    {/* Header Section */}
                    <div style={{
                      background: 'linear-gradient(135deg, #644222 0%, #8b4513 100%)',
                      borderRadius: '15px 15px 0 0',
                      padding: '1.5rem',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-20%',
                        width: '100px',
                        height: '100px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        zIndex: 1
                      }}></div>
                      <div style={{
                        position: 'absolute',
                        bottom: '-30%',
                        left: '-10%',
                        width: '80px',
                        height: '80px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '50%',
                        zIndex: 1
                      }}></div>
                      <h2 className="widget-title" style={{ 
                        color: 'white', 
                        fontSize: '1.6rem', 
                        fontWeight: '700',
                        margin: '0',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 2,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}>
                        🏨 Đặt Phòng Ngay
                      </h2>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.9rem',
                        margin: '0.5rem 0 0 0',
                        position: 'relative',
                        zIndex: 2
                      }}>
                        Ưu đãi đặc biệt hôm nay
                      </p>
                    </div>

                    {/* Booking Section */}
                    <div className="booking">
                      <div className="contact-bg" style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        borderRadius: '0 0 15px 15px',
                        padding: '2rem 1.5rem',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e9ecef',
                        borderTop: 'none',
                        position: 'relative'
                      }}>
                        {/* Price Display */}
                        <div style={{
                          background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)',
                          borderRadius: '10px',
                          padding: '1rem',
                          marginBottom: '1.5rem',
                          textAlign: 'center',
                          border: '2px solid #e3f2fd'
                        }}>
                          <div style={{
                            fontSize: '0.9rem',
                            color: '#666',
                            marginBottom: '0.25rem'
                          }}>
                            Giá từ
                          </div>
                          <div style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            color: '#644222',
                            marginBottom: '0.25rem'
                          }}>
                            {priceText} VNĐ
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            color: '#888'
                          }}>
                            / đêm
                          </div>
                        </div>

                        <form className="contact-form mt-30" onSubmit={(e) => e.preventDefault()}>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="slider-btn mt-15">
                                <div className="mb-50" style={{ textAlign: 'center' }}>
                                  <a 
                                    href={`/booking?roomId=${id}`} 
                                    className="btn ss-btn"
                                    style={{
                                      background: 'linear-gradient(135deg, #644222 0%, #8b4513 100%)',
                                      color: 'white',
                                      padding: '15px 40px',
                                      borderRadius: '30px',
                                      textDecoration: 'none',
                                      display: 'inline-block',
                                      fontSize: '1.1rem',
                                      fontWeight: '700',
                                      textTransform: 'uppercase',
                                      letterSpacing: '1px',
                                      boxShadow: '0 6px 20px rgba(100, 66, 34, 0.4)',
                                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                      border: 'none',
                                      cursor: 'pointer',
                                      minWidth: '220px',
                                      position: 'relative',
                                      overflow: 'hidden'
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(100, 66, 34, 0.5)';
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(100, 66, 34, 0.4)';
                                    }}
                                  >
                                    <span style={{ position: 'relative', zIndex: 2 }}>
                                      ✨ Đặt Phòng Ngay
                                    </span>
                                    <div style={{
                                      position: 'absolute',
                                      top: '0',
                                      left: '-100%',
                                      width: '100%',
                                      height: '100%',
                                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                                      transition: 'left 0.5s',
                                      zIndex: 1
                                    }}></div>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>

                        {/* Features List */}
                        <div style={{
                          marginTop: '1.5rem',
                          padding: '1rem',
                          background: 'rgba(100, 66, 34, 0.05)',
                          borderRadius: '8px',
                          border: '1px solid rgba(100, 66, 34, 0.1)'
                        }}>
                          <div style={{
                            fontSize: '0.9rem',
                            color: '#644222',
                            fontWeight: '600',
                            marginBottom: '0.75rem',
                            textAlign: 'center'
                          }}>
                            🎁 Ưu đãi bao gồm:
                          </div>
                          <ul style={{
                            listStyle: 'none',
                            padding: '0',
                            margin: '0',
                            fontSize: '0.85rem',
                            color: '#666'
                          }}>
                            <li style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center' }}>
                              <span style={{ color: '#28a745', marginRight: '0.5rem' }}>✓</span>
                              Miễn phí hủy đặt phòng
                            </li>
                            <li style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center' }}>
                              <span style={{ color: '#28a745', marginRight: '0.5rem' }}>✓</span>
                              WiFi miễn phí tốc độ cao
                            </li>
                            <li style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center' }}>
                              <span style={{ color: '#28a745', marginRight: '0.5rem' }}>✓</span>
                              Dịch vụ 24/7
                            </li>
                            <li style={{ marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                              <span style={{ color: '#28a745', marginRight: '0.5rem' }}>✓</span>
                              Bữa sáng miễn phí
                            </li>
                          </ul>
                        </div>
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
                      onLoad={() => {
                        console.log('Image loaded successfully:', currentImage.imageUrl);
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', currentImage.imageUrl);
                        console.error('Error event:', e);
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
                          key={index}
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
                  <h3>Tiện Nghi Phòng</h3>
                  <ul className="room-features d-flex align-items-center" style={{ flexWrap: 'wrap' }}>
                    <li><FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px', color: '#644222' }} /> Adults: {room.capacity || 2}</li>
                    {room.roomDetail?.roomSize && <li><FontAwesomeIcon icon={faExpandArrowsAlt} style={{ marginRight: '8px', color: '#644222' }} /> Size: {room.roomDetail.roomSize}m²</li>}
                    {room.roomDetail?.bedType && <li><FontAwesomeIcon icon={faBed} style={{ marginRight: '8px', color: '#644222' }} /> Bed: {room.roomDetail.bedType}</li>}
                    {room.roomDetail?.floor && <li><FontAwesomeIcon icon={faLayerGroup} style={{ marginRight: '8px', color: '#644222' }} /> Floor: {room.roomDetail.floor}</li>}
                    {room.roomDetail?.viewType && <li><FontAwesomeIcon icon={faMountain} style={{ marginRight: '8px', color: '#644222' }} /> View: {room.roomDetail.viewType}</li>}
                    
                    {/* Room Details Amenities */}
                    {room.roomDetail?.wifiSpeed && <li><FontAwesomeIcon icon={faWifi} style={{ marginRight: '8px', color: '#644222' }} /> WiFi: {room.roomDetail.wifiSpeed}</li>}
                    {room.roomDetail?.airConditioning && <li><FontAwesomeIcon icon={faSnowflake} style={{ marginRight: '8px', color: '#644222' }} /> Air Conditioning</li>}
                    {room.roomDetail?.minibar && <li><FontAwesomeIcon icon={faWineBottle} style={{ marginRight: '8px', color: '#644222' }} /> Minibar</li>}
                    {room.roomDetail?.balcony && <li><FontAwesomeIcon icon={faUmbrellaBeach} style={{ marginRight: '8px', color: '#644222' }} /> Balcony</li>}
                    {room.roomDetail?.oceanView && <li><FontAwesomeIcon icon={faWater} style={{ marginRight: '8px', color: '#644222' }} /> Ocean View</li>}
                    {room.roomDetail?.petFriendly && <li><FontAwesomeIcon icon={faPaw} style={{ marginRight: '8px', color: '#644222' }} /> Pet Friendly</li>}
                    {room.roomDetail?.smokingAllowed && <li><FontAwesomeIcon icon={faSmokingBan} style={{ marginRight: '8px', color: '#644222' }} /> Smoking Allowed</li>}
                    
                    {/* Additional Amenities from Database */}
                    {room.amenities && room.amenities.map((amenity, index) => {
                      // Function to get appropriate icon based on amenity name
                      const getAmenityIcon = (name: string) => {
                        const lowerName = name.toLowerCase();
                        if (lowerName.includes('wifi') || lowerName.includes('internet')) return faWifi;
                        if (lowerName.includes('tv') || lowerName.includes('television')) return faTv;
                        if (lowerName.includes('air') || lowerName.includes('conditioning')) return faSnowflake;
                        if (lowerName.includes('safe') || lowerName.includes('security')) return faShieldAlt;
                        if (lowerName.includes('minibar') || lowerName.includes('mini bar')) return faWineBottle;
                        if (lowerName.includes('balcony') || lowerName.includes('terrace')) return faUmbrellaBeach;
                        if (lowerName.includes('ocean') || lowerName.includes('sea') || lowerName.includes('view')) return faWater;
                        if (lowerName.includes('pet') || lowerName.includes('animal')) return faPaw;
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
                        return faCheckCircle; // Default icon
                      };

                      return (
                        <li key={amenity.amenityId || index}>
                          <FontAwesomeIcon 
                            icon={getAmenityIcon(amenity.name)} 
                            style={{ marginRight: '8px', color: '#644222' }} 
                          /> 
                          {amenity.name}
                        </li>
                      );
                    })}
                  </ul>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Suggested Rooms Section */}
      <SuggestedRooms currentRoomId={room.roomId || room.id} limit={3} />
    </>
  )
}

export default RoomDetail