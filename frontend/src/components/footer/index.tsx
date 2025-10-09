import logo from '../../assets/img/logo/logo.png'
import footer from '../../assets/img/bg/footer-bg.png'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <footer className="footer-bg footer-p">
      <div className="footer-top  pt-90 pb-40" style={{ backgroundColor: '#644222', backgroundImage: `url(${footer})` }}>
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <div className="footer-widget mb-30">
                <div className="f-widget-title mb-30">
                  <img src={logo} alt="img" />
                </div>
                <div className="f-contact">
                  <ul>
                    <li>
                      <i className="icon fal fa-phone" />
                      <span>1800-121-3637<br />+91-7052-101-786</span>
                    </li>
                    <li><i className="icon fal fa-envelope" />
                      <span>
                        <Link to="mailto:info@example.com">info@example.com</Link>
                        <br />
                        <Link to="mailto:help@example.com">help@example.com</Link>
                      </span>
                    </li>
                    <li>
                      <i className="icon fal fa-map-marker-check" />
                      <span>1247/Plot No. 39, 15th Phase,<br /> LHB Colony, Kanpur</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-2 col-sm-6">
              <div className="footer-widget mb-30">
                <div className="f-widget-title">
                  <h2>Liên kết</h2>
                </div>
                <div className="footer-link">
                  <ul>
                    <li><Link to="/">Trang chủ</Link></li>
                    <li><Link to="/about">Giới thiệu</Link></li>
                    <li><Link to="/services">Dịch vụ</Link></li>
                    <li><Link to="/contact">Liên hệ</Link></li>
                    <li><Link to="/blog">Tin tức</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-2 col-sm-6">
              <div className="footer-widget mb-30">
                <div className="f-widget-title">
                  <h2>Dịch vụ</h2>
                </div>
                <div className="footer-link">
                  <ul>
                    <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
                    <li><Link to="#">Hỗ trợ</Link></li>
                    <li><Link to="#">Quyền riêng tư</Link></li>
                    <li><Link to="#">Điều khoản &amp; Điều kiện</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <div className="footer-widget mb-30">
                <div className="f-widget-title">
                  <h2>Đăng ký nhận bản tin</h2>
                </div>
                <div className="footer-link">
                  <div className="subricbe p-relative" data-animation="fadeInDown" data-delay=".4s">
                    <form action="https://htmldemo.zcubethemes.com/riorelax/news-mail.php" method="post" className="contact-form ">
                      <input type="text" id="email2" name="email2" className="header-input" placeholder="Email của bạn..." required />
                      <button className="btn header-btn"> <i className="fas fa-location-arrow" /> </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6">
              Bản quyền © Riorelax 2022. Tất cả các quyền được bảo lưu.
            </div>
            <div className="col-lg-6 col-md-6 text-right text-xl-right">
              <div className="footer-social">
                <Link to="#"><i className="fab fa-facebook-f" /></Link>
                <Link to="#"><i className="fab fa-twitter" /></Link>
                <Link to="#"><i className="fab fa-instagram" /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer