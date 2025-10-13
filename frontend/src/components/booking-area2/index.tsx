import { useNavigate } from 'react-router-dom';
import bookingImg from '../../assets/img/bg/booking-img.png'
import anImg01 from '../../assets/img/bg/an-img-01.png'

const BookingArea2 = () => {
  const navigate = useNavigate();
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
                <div className="row">
                  

                  <div className="col-lg-12">
                    <div className="slider-btn mt-15">
                      <button 
                        className="btn ss-btn" 
                        data-animation="fadeInRight" 
                        data-delay=".8s"
                        onClick={() => navigate('/room')}
                      >
                        <span>Book Table Now</span>
                      </button>
                    </div>
                  </div>
                </div>
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