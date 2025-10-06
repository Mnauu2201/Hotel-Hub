import { Link } from 'react-router-dom'
import anImg02 from '../../assets/img/bg/an-img-02.png'
import featureImg from '../../assets/img/features/feature.png'

const FeatureArea = () => {
  return (
    <section className="feature-area2 p-relative fix" style={{ background: '#f7f5f1' }}>
      <div className="animations-02"><img src={anImg02} alt="contact-bg-an-05" /></div>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 col-md-12 col-sm-12 pr-30">
            <div className="feature-img">
              <img src={featureImg} alt="img" className="img" />
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="feature-content s-about-content">
              <div className="feature-title pb-20">
                <h5>Khách sạn &amp; Khu nghỉ dưỡng sang trọng</h5>
                <h2>
                  Viên ngọc của biển Adriatic
                </h2>
              </div>
              <p>Chúng tôi tự hào mang đến không gian nghỉ dưỡng đẳng cấp với thiết kế tinh tế và dịch vụ chuyên nghiệp. Mỗi chi tiết trong khách sạn đều được chăm chút tỉ mỉ để đảm bảo kỳ nghỉ của quý khách trở nên hoàn hảo và đáng nhớ.</p>
              <p>Với vị trí đắc địa và cảnh quan tuyệt đẹp, khách sạn chúng tôi là điểm đến lý tưởng cho những ai muốn tận hưởng kỳ nghỉ thư giãn, hội nghị sang trọng hay những dịp kỷ niệm đặc biệt. Hãy đến và trải nghiệm dịch vụ đẳng cấp của chúng tôi.</p>
              <div className="slider-btn mt-15">
                <Link to="/about" className="btn ss-btn smoth-scroll">Tìm hiểu thêm</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureArea