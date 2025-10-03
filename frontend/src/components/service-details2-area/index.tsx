import { Link } from 'react-router-dom'
import anImg01 from '../../assets/img/bg/an-img-01.png'
import feIcon01 from '../../assets/img/icon/fe-icon01.png'
import feIcon04 from '../../assets/img/icon/fe-icon04.png'
import feIcon05 from '../../assets/img/icon/fe-icon05.png'
import feIcon06 from '../../assets/img/icon/fe-icon06.png'
import feIcon07 from '../../assets/img/icon/fe-icon07.png'
import feIcon08 from '../../assets/img/icon/fe-icon08.png'

const ServiceDetails2Area = () => {
  return (
    <section id="service-details2" className="pt-120 pb-90 p-relative" style={{ backgroundColor: '#f7f5f1' }}>
      <div className="animations-01"><img src={anImg01} alt="an-img-01" /></div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="section-title center-align mb-50 text-center">
              <h5>Explore</h5>
              <h2>
                The Hotel
              </h2>
              <p>Proin consectetur non dolor vitae pulvinar. Pellentesque sollicitudin dolor eget neque viverra, sed interdum metus interdum. Cras lobortis pulvinar dolor, sit amet ullamcorper dolor iaculis vel</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="services-08-item mb-30">
              <div className="services-icon2">
                <img src={feIcon01} alt="img" />
              </div>
              <div className="services-08-thumb">
                <img src={feIcon01} alt="img" />
              </div>
              <div className="services-08-content">
                <h3><Link to="/service-detail"> Qulity Room</Link></h3>
                <p>Nullam molestie lacus sit amet velit fermentum feugiat. Mauris auctor eget nunc sit amet.</p>
                <Link to="/service-detail">Read More <i className="fal fa-long-arrow-right" /></Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="services-08-item mb-30">
              <div className="services-icon2">
                <img src={feIcon04} alt="img" />
              </div>
              <div className="services-08-thumb">
                <img src={feIcon04} alt="img" />
              </div>
              <div className="services-08-content">
                <h3><Link to="/service-detail">Privet Beach</Link></h3>
                <p>Nullam molestie lacus sit amet velit fermentum feugiat. Mauris auctor eget nunc sit amet.</p>
                <Link to="/service-detail">Read More <i className="fal fa-long-arrow-right" /></Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="services-08-item mb-30">
              <div className="services-icon2">
                <img src={feIcon05} alt="img" />
              </div>
              <div className="services-08-thumb">
                <img src={feIcon05} alt="img" />
              </div>
              <div className="services-08-content">
                <h3><Link to="/service-detail">Best Accommodation</Link></h3>
                <p>Nullam molestie lacus sit amet velit fermentum feugiat. Mauris auctor eget nunc sit amet.</p>
                <Link to="/service-detail">Read More <i className="fal fa-long-arrow-right" /></Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="services-08-item mb-30">
              <div className="services-icon2">
                <img src={feIcon06} alt="img" />
              </div>
              <div className="services-08-thumb">
                <img src={feIcon06} alt="img" />
              </div>
              <div className="services-08-content">
                <h3><Link to="/service-detail"> Wellness &amp; Spa</Link></h3>
                <p>Nullam molestie lacus sit amet velit fermentum feugiat. Mauris auctor eget nunc sit amet.</p>
                <Link to="/service-detail">Read More <i className="fal fa-long-arrow-right" /></Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="services-08-item mb-30">
              <div className="services-icon2">
                <img src={feIcon07} alt="img" />
              </div>
              <div className="services-08-thumb">
                <img src={feIcon07} alt="img" />
              </div>
              <div className="services-08-content">
                <h3><Link to="/service-detail">Restaurants &amp; Bars</Link></h3>
                <p>Nullam molestie lacus sit amet velit fermentum feugiat. Mauris auctor eget nunc sit amet.</p>
                <Link to="/service-detail">Read More <i className="fal fa-long-arrow-right" /></Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="services-08-item mb-30">
              <div className="services-icon2">
                <img src={feIcon08} alt="img" />
              </div>
              <div className="services-08-thumb">
                <img src={feIcon08} alt="img" />
              </div>
              <div className="services-08-content">
                <h3><Link to="/service-detail">Special Offers</Link></h3>
                <p>Nullam molestie lacus sit amet velit fermentum feugiat. Mauris auctor eget nunc sit amet.</p>
                <Link to="/service-detail">Read More <i className="fal fa-long-arrow-right" /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceDetails2Area