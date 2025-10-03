import roomImg1 from '../../assets/img/gallery/room-img01.png'
import roomImg2 from '../../assets/img/gallery/room-img02.png'
import roomImg3 from '../../assets/img/gallery/room-img03.png'
import roomImg4 from '../../assets/img/gallery/room-img04.png'

import sveIcon1 from '../../assets/img/icon/sve-icon1.png'
import sveIcon2 from '../../assets/img/icon/sve-icon2.png'
import sveIcon3 from '../../assets/img/icon/sve-icon3.png'
import sveIcon4 from '../../assets/img/icon/sve-icon4.png'
import sveIcon5 from '../../assets/img/icon/sve-icon5.png'
import sveIcon6 from '../../assets/img/icon/sve-icon6.png'

import { useEffect } from "react";
import $ from "jquery";
import "slick-carousel";
import { Link } from 'react-router-dom'

const RoomArea = () => {
  useEffect(() => {
    const $slider = $(".services-active");

    if ($slider.hasClass("slick-initialized")) {
      $slider.slick("unslick");
    }

    $slider.slick({
      dots: true,
      infinite: true,
      arrows: false,
      speed: 1000,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1200,
          settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true, dots: true },
        },
        { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      ],
    });


    return () => {
      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("unslick");
      }
    };
  }, []);
  return (
    <section id="services" className="services-area pt-113 pb-150">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-12">
            <div className="section-title center-align mb-50 text-center">
              <h5>The pleasure of luxury</h5>
              <h2>Rooms &amp; Suites</h2>
              <p>Proin consectetur non dolor vitae pulvinar. Pellentesque sollicitudin dolor eget neque viverra, sed interdum metus interdum. Cras lobortis pulvinar dolor, sit amet ullamcorper dolor iaculis vel</p>
            </div>
          </div>
        </div>
        <div className="row services-active">
          <div className="col-xl-4 col-md-6">
            <div className="single-services mb-30">
              <div className="services-thumb">
                <Link className="gallery-link popup-image" to="/room-detail">
                  <img src={roomImg1} alt="img" />
                </Link>
              </div>
              <div className="services-content">
                <div className="day-book">
                  <ul>
                    <li>$600/Night</li>
                    <li><Link to="/contact">Book Now</Link></li>
                  </ul>
                </div>
                <h4><Link to="/room-detail">Classic Balcony Room</Link></h4>
                <p>Aenean vehicula ligula eu rhoncus porttitor. Duis vel lacinia quam. Nunc rutrum porta place ullam ipsum. Morbi imperdiet, orci et dapibus.</p>
                <div className="icon">
                  <ul>
                    <li><img src={sveIcon1} alt="img" /></li>
                    <li><img src={sveIcon2} alt="img" /></li>
                    <li><img src={sveIcon3} alt="img" /></li>
                    <li><img src={sveIcon4} alt="img" /></li>
                    <li><img src={sveIcon5} alt="img" /></li>
                    <li><img src={sveIcon6} alt="img" /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6">
            <div className="single-services mb-30">
              <div className="services-thumb">
                <Link className="gallery-link popup-image" to="/room-detail">
                  <img src={roomImg2} alt="img" />
                </Link>
              </div>
              <div className="services-content">
                <div className="day-book">
                  <ul>
                    <li>$400/Night</li>
                    <li><Link to="/contact">Book Now</Link></li>
                  </ul>
                </div>
                <h4><Link to="/room-detail">Superior Double Room</Link></h4>
                <p>Aenean vehicula ligula eu rhoncus porttitor. Duis vel lacinia quam. Nunc rutrum porta ex, in imperdiet tortor feugiat at.</p>
                <div className="icon">
                  <ul>
                    <li><img src={sveIcon1} alt="img" /></li>
                    <li><img src={sveIcon2} alt="img" /></li>
                    <li><img src={sveIcon3} alt="img" /></li>
                    <li><img src={sveIcon4} alt="img" /></li>
                    <li><img src={sveIcon5} alt="img" /></li>
                    <li><img src={sveIcon6} alt="img" /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6">
            <div className="single-services mb-30">
              <div className="services-thumb">
                <Link className="gallery-link popup-image" to="/room-detail">
                  <img src={roomImg3} alt="img" />
                </Link>
              </div>
              <div className="services-content">
                <div className="day-book">
                  <ul>
                    <li>$100/Night</li>
                    <li><Link to="/contact">Book Now</Link></li>
                  </ul>
                </div>
                <h4><Link to="/room-detail">Super Balcony Double Room</Link></h4>
                <p>Aenean vehicula ligula eu rhoncus porttitor. Duis vel lacinia quam. Nunc rutrum porta place ullam ipsum. Morbi imperdiet, orci et dapibus.</p>
                <div className="icon">
                  <ul>
                    <li><img src={sveIcon1} alt="img" /></li>
                    <li><img src={sveIcon2} alt="img" /></li>
                    <li><img src={sveIcon3} alt="img" /></li>
                    <li><img src={sveIcon4} alt="img" /></li>
                    <li><img src={sveIcon5} alt="img" /></li>
                    <li><img src={sveIcon6} alt="img" /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6">
            <div className="single-services mb-30">
              <div className="services-thumb">
                <Link className="gallery-link popup-image" to="/room-detail">
                  <img src={roomImg4} alt="img" />
                </Link>
              </div>
              <div className="services-content">
                <div className="day-book">
                  <ul>
                    <li>$300/Night</li>
                    <li><Link to="/contact">Book Now</Link></li>
                  </ul>
                </div>
                <h4><Link to="/room-detail">Delux Double Room</Link></h4>
                <p>Aenean vehicula ligula eu rhoncus porttitor. Duis vel lacinia quam. Nunc rutrum porta place ullam ipsum. Morbi imperdiet, orci et dapibus.</p>
                <div className="icon">
                  <ul>
                    <li><img src={sveIcon1} alt="img" /></li>
                    <li><img src={sveIcon2} alt="img" /></li>
                    <li><img src={sveIcon3} alt="img" /></li>
                    <li><img src={sveIcon4} alt="img" /></li>
                    <li><img src={sveIcon5} alt="img" /></li>
                    <li><img src={sveIcon6} alt="img" /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RoomArea