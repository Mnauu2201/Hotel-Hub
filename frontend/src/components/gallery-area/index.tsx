import { useEffect } from "react";
import $ from "jquery";
import "magnific-popup/dist/jquery.magnific-popup.min.js";
import "magnific-popup/dist/magnific-popup.css";


declare global {
  interface JQuery {
    magnificPopup(options?: any): JQuery;
  }
}

import protfolioImg01 from '../../assets/img/gallery/protfolio-img01.png'
import protfolioImg02 from '../../assets/img/gallery/protfolio-img02.png'
import protfolioImg03 from '../../assets/img/gallery/protfolio-img03.png'
import protfolioImg04 from '../../assets/img/gallery/protfolio-img04.png'
import protfolioImg05 from '../../assets/img/gallery/protfolio-img05.png'
import protfolioImg06 from '../../assets/img/gallery/protfolio-img06.png'
import protfolioImg07 from '../../assets/img/gallery/protfolio-img07.png'
import protfolioImg08 from '../../assets/img/gallery/protfolio-img08.png'
import protfolioImg09 from '../../assets/img/gallery/protfolio-img09.png'
import protfolioImg10 from '../../assets/img/gallery/protfolio-img10.png'
import { Link } from "react-router-dom";

const GalleryArea = () => {
  useEffect(() => {
    $(".popup-image").magnificPopup({
      type: 'image',
      gallery: { enabled: true }
    });
  }, []);

  const images = [
    { src: protfolioImg01, category: 'financial' },
    { src: protfolioImg02, category: 'banking' },
    { src: protfolioImg03, category: 'insurance' },
    { src: protfolioImg04, category: 'family' },
    { src: protfolioImg05, category: 'business' },
    { src: protfolioImg06, category: 'financial' },
    { src: protfolioImg07, category: 'banking' },
    { src: protfolioImg08, category: 'insurance' },
    { src: protfolioImg09, category: 'family' },
    { src: protfolioImg10, category: 'business' },
  ];

  return (
    <section className="profile fix pt-120">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="my-masonry text-center mb-50">
              <div className="button-group filter-button-group">
                <button className="active" data-filter="*">All</button>
                <button data-filter=".financial">Room</button>
                <button data-filter=".banking">Hall</button>
                <button data-filter=".insurance">Guardian</button>
                <button data-filter=".family">Hotel</button>
                <button data-filter=".business">Event Hall</button>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="masonry-gallery-huge">
              <div className="grid col2" style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'center'
              }}>
                {images.map((img, idx) => (
                  <div key={idx} className={`grid-item ${img.category}`}>
                    <Link className="popup-image" to={img.src}>
                      <figure className="gallery-image">
                        <img src={img.src} alt="img" className="img" />
                      </figure>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GalleryArea;
