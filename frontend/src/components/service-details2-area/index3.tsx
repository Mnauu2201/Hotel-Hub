import { Link } from 'react-router-dom';
import protfolioImg01 from '../../assets/img/gallery/protfolio-img01.png';
import protfolioImg03 from '../../assets/img/gallery/protfolio-img03.png';
import protfolioImg04 from '../../assets/img/gallery/protfolio-img04.png';

const ServiceDetails3Area = () => {
  return (
    <div className="about-area5 about-p p-relative">
      <div className="container pt-120 pb-90">
        <div className="row">
          {/* #right side */}
          <div className="col-sm-12 col-md-12 col-lg-4 order-1">
            <aside className="sidebar services-sidebar">
              {/* Category Widget */}
              <div className="sidebar-widget categories">
                <div className="widget-content">
                  <h2 className="widget-title"> Services List </h2>
                  {/* Services Category */}
                  <ul className="services-categories">
                    <li><Link to="/service-detail">Electrical system </Link></li>
                    <li className="active"><Link to="/service-detail">Tire and wheel </Link></li>
                    <li><Link to="/service-detail">System service </Link></li>
                    <li><Link to="/service-detail">Engine diagnostics </Link></li>
                    <li><Link to="/service-detail"> Drivability problems </Link></li>
                    <li><Link to="/service-detail">Accident Insurance</Link></li>
                  </ul>
                </div>
              </div>
              {/*Service Contact*/}
              <div className="service-detail-contact wow fadeup-animation" data-wow-delay="1.1s">
                <h3 className="h3-title">If You Need Any Help Contact With Us</h3>
                <Link to="javascript:void(0);" title="Call now">+91 705 2101 786</Link>
              </div>
            </aside>
          </div>
          {/* #right side end */}
          <div className="col-lg-8 col-md-12 col-sm-12 order-2">
            <div className="service-detail">
              <div className="content-box">
                <h2> We give the best Services </h2>
                <p>Pleasure and praising pain was born and I will give you a complete account of the systems, and expound the actually teachings of the great explorer of the truth, the master-builder of human uts happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally Nor who loves or pursues or desires to obtain pain of itself.</p>
                {/* Two Column */}
                <div className="two-column">
                  <div className="row">
                    <div className="image-column col-xl-6 col-lg-12 col-md-12">
                      <figure className="image"><img src={protfolioImg04} alt="" /></figure>
                    </div>
                    <div className="text-column col-xl-6 col-lg-12 col-md-12">
                      <figure className="image"><img src={protfolioImg03} alt="" /></figure>
                    </div>
                  </div>
                </div>
                <h3>Why Choose This Service</h3>
                <p>Complete account of the systems and expound the actually teachings of the great explorer of the truth, the master-builder of human uts happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely.</p>
                <p>Complete account of the systems and expound the actually teachings of the great explorer of the truth, the master-builder of human uts happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally.</p>
                <h3>We guarantee to deliver</h3>
                <p>Quam parturient mi amet curae augue varius laoreet vehicula non sem aliquet lectus justo litora fames estab phasellus risus ad sollicitudin magna Viverra diam pretium cursus curabitur parturient convallis hymenaeos suspendisse nibh facilisi purus penatibus habitasse mus orcine muscle adipiscing sapien aliquam nulla. Erat parturient auctor facilisis. Nisi cum fringilla hymenaeos ridiculus habitasses augue nullam fringilla. Taciti convallis. Vitae sapien nisi enim vis metus cras fusce lectus sed luctus quis Clas nisl blandit parturient molestie praesent nec</p>
                {/* Two Column */}
                <div className="two-column">
                  <div className="row">
                    <div className="image-column col-xl-12 col-lg-12 col-md-12">
                      <figure className="image"><img src={protfolioImg01} alt="" /></figure>
                    </div>
                  </div>
                </div>
                <p>Phasellus hac phasellus consequat malesuada veler aliquam dictumst amet a phasellus lacinia integer curabitur duis. Urna taciti nisl torquent varius libero dui. Tempus magnis libero pulvinar purus pharetra justo sem curae duis eget tempus erat ornare. Consequat litora a blandit fermentum. Quam taciti site nascetur nunc litora quis tempor metus adipiscing ac quis sodales ultrices cubilia. Arcu in penatibus vestibulum diam. Curabitur platea quam fusce molestie venenatis platea ligula in aenean gravida dolor aptent nostra luctus rutrum morbi porttitor cursus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetails3Area;