import sldierbg01 from '../../assets/img/slider/slider_bg_01.png'
import { useEffect } from "react";
import $ from "jquery";
import "slick-carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
const SliderAreaHomePage3 = () => {
  useEffect(() => {
    const $slider = $(".slider-active");

    if ($slider.length > 0) {

      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("unslick");
      }


      $slider.on("init", function () {
        const $firstAnimatingElements = $(".single-slider:first-child").find(
          "[data-animation]"
        );
        doAnimations($firstAnimatingElements);
      });

      $slider.on("beforeChange", function (_e, _slick, _current, next) {
        const $animatingElements = $(
          `.single-slider[data-slick-index="${next}"]`
        ).find("[data-animation]");
        doAnimations($animatingElements);
      });

      $slider.slick({
        autoplay: true,
        autoplaySpeed: 10000,
        dots: false,
        fade: true,
        arrows: true,
        prevArrow:
          '<button type="button" class="slick-prev"><i class="far fa-angle-left"></i></button>',
        nextArrow:
          '<button type="button" class="slick-next"><i class="far fa-angle-right"></i></button>',
        responsive: [
          {
            breakpoint: 1200,
            settings: { dots: false, arrows: false },
          },
        ],
      });
    }


    return () => {
      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("unslick");
      }
    };
  }, []);


  const doAnimations = (elements: JQuery<HTMLElement>) => {
    const animationEndEvents =
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
    elements.each(function () {
      const $this = $(this);
      const $animationDelay = $this.data("delay");
      const $animationType = "animated " + $this.data("animation");
      $this.css({
        "animation-delay": $animationDelay,
        "-webkit-animation-delay": $animationDelay,
      });
      $this
        .addClass($animationType)
        .one(animationEndEvents, function () {
          $this.removeClass($animationType);
        });
    });
  };
  return (
    <section id="home" className="slider-area fix p-relative">
      <div className="slider-active" style={{ backgroundImage: `url(${sldierbg01})`, backgroundSize: 'cover' }}>
        <div className="single-slider slider-bg d-flex align-items-center" style={{ backgroundImage: `url(${sldierbg01})`, backgroundSize: 'cover' }}>
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-lg-7 col-md-7">
                <div className="slider-content s-slider-content mt-100">
                  <h2 data-animation="fadeInUp" data-delay=".4s">Enjoy A Luxuary Experience</h2>
                  <p data-animation="fadeInUp" data-delay=".6s">Donec vitae libero non enim placerat eleifend aliquam erat volutpat. Curabitur diam ex, dapibus purus sapien, cursus sed nisl tristique, commodo gravida lectus non.</p>
                  <div className="slider-btn mt-30 mb-105">
                    <Link to="/contact" className="btn ss-btn active" data-animation="fadeInLeft" data-delay=".4s">Visit Our Shop</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-5 p-relative">
                {/* booking-area */}
                <div className="booking-area booking-area2 p-relative">
                  <div className="container">
                    <form action="#" className="contact-form">
                      <div className="row align-items-center">
                        <div className="col-lg-12">
                          <div className="section-title center-align mb-30">
                            <h2>
                              Book A Room
                            </h2>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="contact-field p-relative c-name mb-30">
                            <label><i className="fal fa-badge-check" /> Check In Date</label>
                            <input type="date" id="chackin2" name="date" />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="contact-field p-relative c-name mb-30">
                            <label><i className="fal fa-times-octagon" /> Check Out Date</label>
                            <input type="date" id="chackout2" name="date" />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="contact-field p-relative c-name mb-30">
                            <label><i className="fal fa-users" /> Adults</label>
                            <select name="adults" id="adu2">
                              <option value="sports-massage">Adults</option>
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="contact-field p-relative c-name mb-30">
                            <label><i className="fal fa-baby" /> Child</label>
                            <select name="child" id="cld">
                              <option value="sports-massage">Child</option>
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="contact-field p-relative c-name mb-30">
                            <label><i className="fal fa-concierge-bell" /> Room</label>
                            <select name="room" id="rm2">
                              <option value="sports-massage">Room</option>
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="slider-btn mb-20">
                            <button className="btn ss-btn" data-animation="fadeInRight" data-delay=".8s">Check Availability</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                {/* booking-area-end */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export default SliderAreaHomePage3