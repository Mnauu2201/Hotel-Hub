import { Link } from 'react-router-dom'
import anImg01 from '../../assets/img/bg/an-img-01.png'
import anImg02 from '../../assets/img/bg/an-img-02.png'

const PricingArea = () => {
  return (
    <section id="pricing" className="pricing-area pt-120 pb-60 fix p-relative">
      <div className="animations-01"><img src={anImg01} alt="an-img-01" /></div>
      <div className="animations-02"><img src={anImg02} alt="contact-bg-an-01" /></div>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-4 col-md-12">
            <div className="section-title mb-20">
              <h5>Best Prices</h5>
              <h2>Extra Services</h2>
            </div>
            <p>Proin consectetur non dolor vitae pulvinar. Pellentesque sollicitudin dolor eget neque viverra, sed interdum metus interdum. Cras lobortis pulvinar dolor, sit amet ullamcorper dolor iaculis vel</p>
            <p>Cras finibus laoreet felis et hendrerit. Integer ligula lorem, finibus vitae lorem at, egestas consectetur urna. Integer id ultricies elit. Maecenas sodales nibh, quis posuere felis. In commodo mi lectus venenatis metus eget fringilla. Suspendisse varius ante eget.</p>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="pricing-box pricing-box2 mb-60">
              <div className="pricing-head">
                <h3>Room cleaning</h3>
                <p>Perfect for early-stage startups</p>
                <div className="month">Monthly</div>
                <div className="price-count">
                  <h2>$39.99</h2>
                </div>
                <hr />
              </div>
              <div className="pricing-body mt-20 mb-30 text-left">
                <ul>
                  <li>Hotel quis justo at lorem</li>
                  <li>Fusce sodales, urna et tempus</li>
                  <li>Vestibulum blandit lorem quis</li>
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
                <h3>Drinks included</h3>
                <p>Perfect for early-stage startups</p>
                <div className="month">Monthly</div>
                <div className="price-count">
                  <h2>$59.99</h2>
                </div>
                <hr />
              </div>
              <div className="pricing-body mt-20 mb-30 text-left">
                <ul>
                  <li>Hotel quis justo at lorem</li>
                  <li>Fusce sodales, urna et tempus</li>
                  <li>Vestibulum blandit lorem quis</li>
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

export default PricingArea