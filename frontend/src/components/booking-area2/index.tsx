import bookingImg from '../../assets/img/bg/booking-img.png'
import anImg01 from '../../assets/img/bg/an-img-01.png'
const BookingArea2 = () => {
  return (
    <section className="booking pt-120 pb-120 p-relative fix">
      <div className="animations-01"><img src={anImg01} alt="an-img-01" /></div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6">
            <div className="contact-bg02">
              <div className="section-title center-align">
                <h5>make appointment</h5>
                <h2>
                  Book A Room
                </h2>
              </div>
              <form action="https://htmldemo.zcubethemes.com/riorelax/mail.php" method="post" className="contact-form mt-30">
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="contact-field p-relative c-name mb-20">
                      <label><i className="fal fa-badge-check" /> Ngày nhận phòng</label>
                      <input type="date" id="chackin2" name="date" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="contact-field p-relative c-subject mb-20">
                      <label><i className="fal fa-times-octagon" /> Ngày trả phòng</label>
      <input type="date" id="chackout2" name="date" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="contact-field p-relative c-subject mb-20">
                      <label><i className="fal fa-users" /> Người lớn</label>
              <select name="adults" id="adu2">
                <option value="sports-massage">Người lớn</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="contact-field p-relative c-option mb-20">
                      <label><i className="fal fa-concierge-bell" /> Phòng</label>
              <select name="room" id="rm2">
                <option value="sports-massage">Phòng</option>
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
                      <button className="btn ss-btn" data-animation="fadeInRight" data-delay=".8s"><span>Book Table Now</span></button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="booking-img">
              <img src={bookingImg} alt="img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookingArea2