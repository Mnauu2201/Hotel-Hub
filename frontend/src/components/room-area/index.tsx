import { useEffect, useState } from "react";
import $ from "jquery";
import "slick-carousel";
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
  faCoffee
} from '@fortawesome/free-solid-svg-icons'

const RoomArea = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms/available')
        setRooms(res.data?.rooms || [])
      } catch (e: any) {
        setError('Không thể tải danh sách phòng nổi bật')
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  useEffect(() => {
    const $slider = $(".services-active");

    if ($slider.hasClass("slick-initialized")) {
      $slider.slick("unslick");
    }

    if (rooms.length > 0) {
      $slider.slick({
        dots: true,
        infinite: true,
        arrows: false,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1200,
            settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true, dots: true },
          },
          { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
          { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
      });
    }

    return () => {
      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("unslick");
      }
    };
  }, [rooms])
  return (
    <section id="services" className="services-area pt-113 pb-150">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-12">
            <div className="section-title center-align mb-50 text-center">
              <h5>Niềm vui của sự sang trọng</h5>
              <h2>Phòng &amp; Suite</h2>
              <p>Chúng tôi mang đến không gian nghỉ dưỡng đẳng cấp với thiết kế tinh tế và tiện nghi hiện đại. Mỗi phòng đều được trang bị đầy đủ để đảm bảo sự thoải mái và tiện lợi tối đa cho quý khách.</p>
            </div>
          </div>
        </div>
        <div className="row services-active" style={{ rowGap: 24 }}>
          {loading && (
            <div className="col-12"><p style={{ textAlign: 'center' }}>Đang tải phòng nổi bật...</p></div>
          )}
          {!loading && error && (
            <div className="col-12"><p style={{ textAlign: 'center', color: '#b91c1c' }}>{error}</p></div>
          )}
          {!loading && !error && rooms.map((room) => {
            const primaryImg = room.images?.find((i: any) => i.isPrimary)?.imageUrl || room.images?.[0]?.imageUrl
            const priceText = (room.price?.toLocaleString?.() || room.price || room.priceAsDouble)?.toString()
            return (
              <div key={room.roomId} className="col-xl-4 col-md-6" style={{ display: 'flex', paddingLeft: 12, paddingRight: 12 }}>
                <div className="single-services mb-30" style={{ height: '100%', minHeight: 560, display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <div className="services-thumb" style={{ width: '100%' }}>
                    <Link className="gallery-link popup-image" to={`/room-detail/${room.roomId}`}>
                      <img src={primaryImg || fallbackRoomImg} alt={room.roomTypeName || 'room'} style={{ width: '100%', height: 260, objectFit: 'cover' }} />
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
                    <p style={{ marginBottom: 'auto' }}>{room.description || 'Trải nghiệm không gian sang trọng và tiện nghi.'}</p>
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

export default RoomArea