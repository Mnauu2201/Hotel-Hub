import bLogo1 from '../../assets/img/brand/b-logo1.png'
import bLogo2 from '../../assets/img/brand/b-logo2.png'
import bLogo3 from '../../assets/img/brand/b-logo3.png'
import bLogo4 from '../../assets/img/brand/b-logo4.png'
import bLogo5 from '../../assets/img/brand/b-logo5.png'
import { useEffect } from "react";
import $ from "jquery";
import "slick-carousel";

const BrandArea = () => {
  useEffect(() => {
    const $brand = $(".brand-active");

    if ($brand.length > 0) {

      if ($brand.hasClass("slick-initialized")) {
        $brand.slick("unslick");
      }

      $brand.slick({
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: false,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 2,
        responsive: [
          {
            breakpoint: 1500,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 3,
              infinite: true,
            },
          },
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }


    return () => {
      if ($brand.hasClass("slick-initialized")) {
        $brand.slick("unslick");
      }
    };
  }, []);


  return (
    <div className="brand-area pt-60 pb-60" style={{ backgroundColor: '#f7f5f1' }}>
      <div className="container">
        <div className="row brand-active">
          <div className="col-xl-2">
            <div className="single-brand">
              <img src={bLogo1} alt="img" />
            </div>
          </div>
          <div className="col-xl-2">
            <div className="single-brand">
              <img src={bLogo2} alt="img" />
            </div>
          </div>
          <div className="col-xl-2">
            <div className="single-brand">
              <img src={bLogo3} alt="img" />
            </div>
          </div>
          <div className="col-xl-2">
            <div className="single-brand">
              <img src={bLogo4} alt="img" />
            </div>
          </div>
          <div className="col-xl-2">
            <div className="single-brand">
              <img src={bLogo5} alt="img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandArea