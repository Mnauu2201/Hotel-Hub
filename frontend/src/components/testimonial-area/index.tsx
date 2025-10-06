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
              <h5>Testimonial</h5>
              <h2>What Our Clients Says</h2>
              <p>Proin consectetur non dolor vitae pulvinar. Pellentesque sollicitudin dolor eget neque viverra, sed interdum metus interdum. Cras lobortis pulvinar dolor, sit amet ullamcorper dolor iaculis vel</p>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="testimonial-active">
              <div className="single-testimonial">
                <div className="testi-author">
                  <img src={testtiAvatar} alt="img" />
                  <div className="ta-info">
                    <h6>Jina Nilson</h6>
                    <span>Client</span>
                  </div>
                </div>
                <div className="review-icon">
                  <img src={reviewIcon} alt="img" />
                </div>
                <p>“Phasellus aliquam quis lorem amet dapibus feugiat vitae purus vitae efficitur. Vestibulum sed elit id orci rhoncus ultricies. Morbi vitae semper consequat ipsum semper quam”.</p>
                <div className="qt-img">
                  <img src={qtIcon} alt="img" />
                </div>
              </div>
              <div className="single-testimonial">
                <div className="testi-author">
                  <img src={testtiAvatar02} alt="img" />
                  <div className="ta-info">
                    <h6>Braitly Dcosta</h6>
                    <span>Client</span>
                  </div>
                </div>
                <div className="review-icon">
                  <img src={reviewIcon} alt="img" />
                </div>
                <p>“Phasellus aliquam quis lorem amet dapibus feugiat vitae purus vitae efficitur. Vestibulum sed elit id orci rhoncus ultricies. Morbi vitae semper consequat ipsum semper quam”.</p>
                <div className="qt-img">
                  <img src={qtIcon} alt="img" />
                </div>
              </div>
              <div className="single-testimonial">
                <div className="testi-author">
                  <img src={testtiAvatar03} alt="img" />
                  <div className="ta-info">
                    <h6>Roboto Dose</h6>
                    <span>Client</span>
                  </div>
                </div>
                <div className="review-icon">
                  <img src={reviewIcon} alt="img" />
                </div>
                <p>“Phasellus aliquam quis lorem amet dapibus feugiat vitae purus vitae efficitur. Vestibulum sed elit id orci rhoncus ultricies. Morbi vitae semper consequat ipsum semper quam”.</p>
                <div className="qt-img">
                  <img src={qtIcon} alt="img" />
                </div>
              </div>
              <div className="single-testimonial">
                <div className="testi-author">
                  <img src={testtiAvatar02} alt="img" />
                  <div className="ta-info">
                    <h6>Braitly Dcosta</h6>
                    <span>Client</span>
                  </div>
                </div>
                <div className="review-icon">
                  <img src={reviewIcon} alt="img" />
                </div>
                <p>“Phasellus aliquam quis lorem amet dapibus feugiat vitae purus vitae efficitur. Vestibulum sed elit id orci rhoncus ultricies. Morbi vitae semper consequat ipsum semper quam”.</p>
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