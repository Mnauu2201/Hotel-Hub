import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import BreadcrumbArea from "../../components/breadcrumb-area"
import api from "../../services/api"

const RoomDetail = () => {
  const { id } = useParams()
  const [room, setRoom] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (loading) return <div style={{ padding: 24, textAlign: 'center' }}>Đang tải chi tiết phòng...</div>
  if (error) return <div style={{ padding: 24, textAlign: 'center', color: '#b91c1c' }}>{error}</div>
  if (!room) return null

  const primaryImg = room.images?.find((i: any) => i.isPrimary)?.imageUrl || room.images?.[0]?.imageUrl
  const priceText = (room.price?.toLocaleString?.() || room.price || room.priceAsDouble)?.toString()
  const formatDate = (d: any) => {
    try {
      const dt = typeof d === 'string' ? new Date(d) : d
      if (!dt || isNaN(dt as any)) return ''
      return new Date(dt).toLocaleString()
    } catch {
      return ''
    }
  }

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
                              <div className="contact-field p-relative c-name mb-20">
                                <label><i className="fal fa-badge-check" /> Check In Date</label>
                                <input type="date" name="checkin" />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="contact-field p-relative c-subject mb-20">
                                <label><i className="fal fa-times-octagon" /> Check Out Date</label>
                                <input type="date" name="checkout" />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="contact-field p-relative c-subject mb-20">
                                <label><i className="fal fa-users" /> Adults</label>
                                <select name="adults" defaultValue={2}>
                                  <option value={1}>1</option>
                                  <option value={2}>2</option>
                                  <option value={3}>3</option>
                                  <option value={4}>4</option>
                                  <option value={5}>5</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="slider-btn mt-15">
                                <button className="btn ss-btn"><span>Book This Room</span></button>
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
                <div className="two-column">
                  <div className="row">
                    <div className="image-column col-xl-6 col-lg-12 col-md-12">
                      <figure className="image"><img src={primaryImg} alt="room" /></figure>
                    </div>
                    <div className="text-column col-xl-6 col-lg-12 col-md-12">
                      {room.images?.slice(0, 2).map((img: any) => (
                        <figure className="image" key={img.imageId || img.imageUrl}><img src={img.imageUrl} alt={img.altText || ''} /></figure>
                      ))}
                    </div>
                  </div>
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
                  <h3>Children and extra beds.</h3>
                  <p>Children are welcome. Rollaway/extra beds may be available upon request.</p>
                  <div className="mb-50">
                    <a href="/contact" className="btn ss-btn">Book This Room</a>
                  </div>
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