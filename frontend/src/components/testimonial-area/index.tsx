import testimonial from '../../assets/img/bg/testimonial-bg.png'
import testtiAvatar from '../../assets/img/testimonial/testi_avatar.png'
import testtiAvatar02 from '../../assets/img/testimonial/testi_avatar_02.png'
import testtiAvatar03 from '../../assets/img/testimonial/testi_avatar_03.png'
import reviewIcon from '../../assets/img/testimonial/review-icon.png'
import qtIcon from '../../assets/img/testimonial/qt-icon.png'
import { useEffect } from "react";
import $ from "jquery";
import "slick-carousel";

const TestimonialArea = () => {
  useEffect(() => {
    const $slider = $(".testimonial-active");

    if ($slider.length > 0) {

      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("unslick");
      }

      $slider.slick({
        slidesToShow: 3,
        slidesToScroll: 2,
        arrows: false,
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
          { breakpoint: 992, settings: { slidesToShow: 1 } },
          { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
      });
    }

    return () => {
      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("unslick");
      }
    };
  }, []);

  return (
    <section className="testimonial-area pt-120 pb-90 p-relative fix" style={{ backgroundImage: `url(${testimonial})`, backgroundSize: 'cover' }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title center-align mb-50 text-center">
              <h5>Đánh giá</h5>
              <h2>Khách hàng nói gì về chúng tôi</h2>
              <p>Chúng tôi tự hào về những phản hồi tích cực từ khách hàng. Mỗi lời khen ngợi là động lực để chúng tôi không ngừng nâng cao chất lượng dịch vụ và mang đến trải nghiệm tuyệt vời nhất.</p>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="testimonial-active">
              <div className="single-testimonial">
                <div className="testi-author">
                  <img src={testtiAvatar} alt="img" />
                  <div className="ta-info">
                    <h6>Nguyễn Thị Lan</h6>
                    <span>Khách hàng</span>
                  </div>
                </div>
                <div className="review-icon">
                  <img src={reviewIcon} alt="img" />
                </div>
                <p>"Khách sạn có dịch vụ tuyệt vời và nhân viên rất chuyên nghiệp. Phòng ốc sạch sẽ, tiện nghi đầy đủ. Tôi sẽ quay lại đây vào lần tới."</p>
                <div className="qt-img">
                  <img src={qtIcon} alt="img" />
                </div>
              </div>
              <div className="single-testimonial">
                <div className="testi-author">
                  <img src={testtiAvatar02} alt="img" />
                  <div className="ta-info">
                    <h6>Trần Văn Minh</h6>
                    <span>Khách hàng</span>
                  </div>
                </div>
                <div className="review-icon">
                  <img src={reviewIcon} alt="img" />
                </div>
                <p>"Vị trí khách sạn rất thuận tiện, gần trung tâm thành phố. Dịch vụ đặt phòng nhanh chóng và dễ dàng. Cảm ơn đội ngũ nhân viên đã hỗ trợ tận tình."</p>
                <div className="qt-img">
                  <img src={qtIcon} alt="img" />
                </div>
              </div>
              <div className="single-testimonial">
                <div className="testi-author">
                  <img src={testtiAvatar03} alt="img" />
                  <div className="ta-info">
                    <h6>Lê Thị Hương</h6>
                    <span>Khách hàng</span>
                  </div>
                </div>
                <div className="review-icon">
                  <img src={reviewIcon} alt="img" />
                </div>
                <p>"Phòng ốc rất đẹp và sạch sẽ. Nhân viên phục vụ chu đáo, nhiệt tình. Tôi rất hài lòng với dịch vụ của khách sạn và sẽ giới thiệu cho bạn bè."</p>
                <div className="qt-img">
                  <img src={qtIcon} alt="img" />
                </div>
              </div>
              <div className="single-testimonial">
                <div className="testi-author">
                  <img src={testtiAvatar02} alt="img" />
                  <div className="ta-info">
                    <h6>Trần Văn Minh</h6>
                    <span>Khách hàng</span>
                  </div>
                </div>
                <div className="review-icon">
                  <img src={reviewIcon} alt="img" />
                </div>
                <p>"Vị trí khách sạn rất thuận tiện, gần trung tâm thành phố. Dịch vụ đặt phòng nhanh chóng và dễ dàng. Cảm ơn đội ngũ nhân viên đã hỗ trợ tận tình."</p>
                <div className="qt-img">
                  <img src={qtIcon} alt="img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialArea