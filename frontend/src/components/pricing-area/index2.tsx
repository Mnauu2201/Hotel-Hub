import { Link } from 'react-router-dom';
import bg01 from '../../assets/img/bg/an-img-01.png';
import bg02 from '../../assets/img/bg/an-img-02.png';

const PricingArea2 = () => {
  return (
    <section id="pricing" className="pricing-area pt-120 pb-60 fix p-relative">
      <div className="animations-01"><img src={bg01} alt="an-img-01" /></div>
      <div className="animations-02"><img src={bg02} alt="contact-bg-an-01" /></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="pricing-box pricing-box2 mb-60">
              <div className="pricing-head">
                <h3> Room cleaning </h3>
                <p>Perfect for early-stage startups</p>
                <div className="month">Monthly</div>
                <div className="price-count">
                  <h2>$29.99</h2>
                </div>
                <hr />
              </div>
              <div className="pricing-body mt-20 mb-30 text-left">
                <ul>
                  <li>Aliquam quis justo at lorem</li>
                  <li>Fusce sodales, urna et tempus</li>
                  <li>Vestibulum blandit lorem quis</li>
                  <li>Orci varius natoque penatibus</li>
                  <li>Aliquam a nisl congue, auctor</li>
                </ul>
              </div>
              <div className="pricing-btn">
                <Link to="/contact" className="btn ss-btn">Get Started <i className="fal fa-angle-right" /></Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="pricing-box pricing-box2 active mb-60">
              <div className="pricing-head">
                <h3> Drinks included </h3>
                <p>Perfect for early-stage startups</p>
                <div className="month">Monthly</div>
                <div className="price-count">
                  <h2>$39.99</h2>
                </div>
                <hr />
              </div>
              <div className="pricing-body mt-20 mb-30 text-left">
                <ul>
                  <li>Aliquam quis justo at lorem</li>
                  <li>Fusce sodales, urna et tempus</li>
                  <li>Vestibulum blandit lorem quis</li>
                  <li>Orci varius natoque penatibus</li>
                  <li>Aliquam a nisl congue, auctor</li>
                </ul>
              </div>
              <div className="pricing-btn">
                <Link to="/contact" className="btn ss-btn">Get Started <i className="fal fa-angle-right" /></Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="pricing-box pricing-box2 mb-60">
              <div className="pricing-head">
                <h3>Premium Offer</h3>
                <p>Perfect for early-stage startups</p>
                <div className="month">Monthly</div>
                <div className="price-count">
                  <h2>$59.99</h2>
                </div>
                <hr />
              </div>
              <div className="pricing-body mt-20 mb-30 text-left">
                <ul>
                  <li>Aliquam quis justo at lorem</li>
                  <li>Fusce sodales, urna et tempus</li>
                  <li>Vestibulum blandit lorem quis</li>
                  <li>Orci varius natoque penatibus</li>
                  <li>Aliquam a nisl congue, auctor</li>
                </ul>
              </div>
              <div className="pricing-btn">
                <Link to="/contact" className="btn ss-btn">Get Started <i className="fal fa-angle-right" /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default PricingArea2