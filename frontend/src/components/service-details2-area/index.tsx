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
              <h5>Khám phá</h5>
              <h2>
                Khách sạn của chúng tôi
              </h2>
              <p>Chúng tôi mang đến không gian nghỉ dưỡng sang trọng với đầy đủ tiện nghi hiện đại. Hãy trải nghiệm dịch vụ đẳng cấp và sự thoải mái tuyệt đối tại khách sạn của chúng tôi</p>
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
                <h3><Link to="/service-detail">Phòng chất lượng</Link></h3>
                <p>Phòng nghỉ sang trọng với đầy đủ tiện nghi hiện đại, mang đến trải nghiệm thoải mái nhất cho quý khách.</p>
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
                <h3><Link to="/service-detail">Bãi biển riêng</Link></h3>
                <p>Tận hưởng không gian riêng tư tuyệt đối với bãi biển dành riêng cho khách của khách sạn.</p>
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
                <h3><Link to="/service-detail">Chỗ ở tốt nhất</Link></h3>
                <p>Chúng tôi cung cấp chỗ ở tốt nhất với đầy đủ tiện nghi và dịch vụ chất lượng cao.</p>
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
                <h3><Link to="/service-detail"> Spa & Spa</Link></h3>
                <p>Nullam molestie lacus sit amet velit fermentum feugiat. Mauris auctor eget nunc sit amet.</p>
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
                <h3><Link to="/service-detail">Spa & Chăm sóc sức khỏe</Link></h3>
                <p>Thư giãn và tái tạo năng lượng với các dịch vụ spa và chăm sóc sức khỏe đẳng cấp.</p>
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
                <h3><Link to="/service-detail">Nhà hàng & Quầy bar</Link></h3>
                <p>Thưởng thức ẩm thực đa dạng và đồ uống thượng hạng tại nhà hàng và quầy bar của chúng tôi.</p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceDetails2Area