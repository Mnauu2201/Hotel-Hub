import { useEffect } from "react";
import $ from "jquery";
import "slick-carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import innerb1 from '../../assets/img/blog/inner_b1.jpg';
import innerb2 from '../../assets/img/blog/inner_b2.jpg';
import innerb3 from '../../assets/img/blog/inner_b3.jpg';
import { Link } from "react-router-dom";

const InnerBlog = () => {
  useEffect(() => {
    const $blog = $(".blog-active");

    $blog.slick({
      dots: false,
      infinite: true,
      arrows: true,
      speed: 1500,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      prevArrow: '<button type="button" class="slick-prev"></button>',
      nextArrow: '<button type="button" class="slick-next"></button>',
    });

    // Cleanup khi component unmount
    return () => {
      if ($blog.hasClass('slick-initialized')) {
        $blog.slick('unslick');
      }
    };
  }, []);

  const slides = [innerb3, innerb2, innerb1];

  return (
    <section className="inner-blog pt-120 pb-105">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {/* Bài viết bình thường */}
            <div className="bsingle__post mb-50">
              <div className="bsingle__post-thumb">
                <img src={innerb1} alt="" />
              </div>
              <div className="bsingle__content">
                <div className="date-home">24 tháng 3 năm 2022</div>
                <h2>
                  <Link to="/blog-details">Trải nghiệm nghỉ dưỡng sang trọng tại khách sạn...</Link>
                </h2>
                <p>Khám phá không gian nghỉ dưỡng đẳng cấp với dịch vụ chất lượng cao...</p>
                <div className="blog__btn">
                  <Link to="#">Xem thêm</Link>
                </div>
              </div>
            </div>

            {/* Bài viết có slider ảnh */}
            <div className="bsingle__post mb-50">
              <div className="bsingle__post-thumb blog-active">
                {slides.map((img, idx) => (
                  <div key={idx} className="slide-post">
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
              <div className="bsingle__content">
                <div className="date-home">24 tháng 3 năm 2022</div>
                <h2>
                  <Link to="/blog-details">Những tiện ích độc đáo tại khách sạn của chúng tôi...</Link>
                </h2>
                <p>Khám phá những tiện ích hiện đại và dịch vụ đẳng cấp tại khách sạn...</p>
                <div className="blog__btn">
                  <Link to="#">Xem thêm</Link>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="pagination-wrap">
              <nav>
                <ul className="pagination">
                  <li className="page-item"><Link to="#"><i className="fas fa-angle-double-left" /></Link></li>
                  <li className="page-item active"><Link to="#">1</Link></li>
                  <li className="page-item"><Link to="#">2</Link></li>
                  <li className="page-item"><Link to="#">3</Link></li>
                  <li className="page-item"><Link to="#">...</Link></li>
                  <li className="page-item"><Link to="#">10</Link></li>
                  <li className="page-item"><Link to="#"><i className="fas fa-angle-double-right" /></Link></li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Sidebar */}
            <aside className="sidebar-widget">
              {/* Search, Follow Us, Categories, Recent Posts, Tags */}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnerBlog;
