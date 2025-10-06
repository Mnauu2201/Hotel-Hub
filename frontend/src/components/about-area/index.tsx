import { Link } from 'react-router-dom'
import anImg02 from '../../assets/img/bg/an-img-02.png'
import aboutImg02 from '../../assets/img/features/about_img_02.png'
import aboutImg03 from '../../assets/img/features/about_img_03.png'
import signature from '../../assets/img/features/signature.png'


const AboutArea = () => {
  return (
    <section className="about-area about-p pt-120 pb-120 p-relative fix">
      <div className="animations-02"><img src={anImg02} alt="contact-bg-an-02" /></div>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="s-about-img p-relative  wow fadeInLeft animated" data-animation="fadeInLeft" data-delay=".4s">
              <img src={aboutImg02} alt="img" />
              <div className="about-icon">
                <img src={aboutImg03} alt="img" />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="about-content s-about-content  wow fadeInRight  animated pl-30" data-animation="fadeInRight" data-delay=".4s">
              <div className="about-title second-title pb-25">
                <h5>Giới thiệu</h5>
                <h2>Khách sạn an toàn và được đánh giá cao nhất tại London.</h2>
              </div>
              <p>Chúng tôi tự hào là một trong những khách sạn hàng đầu tại London với dịch vụ chất lượng cao và môi trường an toàn. Với đội ngũ nhân viên chuyên nghiệp, chúng tôi cam kết mang đến cho quý khách trải nghiệm lưu trú tuyệt vời nhất.</p>
              <p>Khách sạn của chúng tôi được thiết kế với phong cách hiện đại, sang trọng cùng đầy đủ tiện nghi để đáp ứng mọi nhu cầu của quý khách. Chúng tôi luôn nỗ lực không ngừng để nâng cao chất lượng dịch vụ và mang đến sự hài lòng tuyệt đối cho quý khách.</p>
              <div className="about-content3 mt-30">
                <div className="row justify-content-center align-items-center">
                  <div className="col-md-12">
                    <ul className="green mb-30">
                      <li> Bảo hành toàn quốc 24 tháng / 24.000km</li>
                      <li> Dịch vụ chăm sóc khách hàng 24/7 với đội ngũ nhân viên chuyên nghiệp</li>
                      <li> Chương trình khách hàng thân thiết và công nghệ hiện đại</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <div className="slider-btn">
                      <Link to="about" className="btn ss-btn smoth-scroll">Tìm hiểu thêm</Link>
                    </div>
                  </div>
                  <div className="col-md-6 text-right">
                    <div className="signature">
                      <img src={signature} alt="img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutArea