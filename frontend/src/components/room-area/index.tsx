import sveIcon1 from '../../assets/img/icon/sve-icon1.png'
import sveIcon2 from '../../assets/img/icon/sve-icon2.png'
import sveIcon3 from '../../assets/img/icon/sve-icon3.png'
import sveIcon4 from '../../assets/img/icon/sve-icon4.png'
import sveIcon5 from '../../assets/img/icon/sve-icon5.png'
import sveIcon6 from '../../assets/img/icon/sve-icon6.png'

import { useEffect, useState } from "react";
import $ from "jquery";
import "slick-carousel";
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import fallbackRoomImg from '../../assets/img/gallery/room-img01.png'

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

export default RoomArea