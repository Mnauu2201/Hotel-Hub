import { Link } from 'react-router-dom'
import anImg02 from '../../assets/img/bg/an-img-02.png'
import aboutImg02 from '../../assets/img/features/about_img_02.png'
import aboutImg03 from '../../assets/img/features/about_img_03.png'
import signature from '../../assets/img/features/signature.png'

const AboutArea5 = () => {
  return (
    <section className="about-area about-p pt-120 pb-120 p-relative fix">
      <div className="animations-02"><img src={anImg02} alt="contact-bg-an-02" /></div>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="about-content s-about-content  wow fadeInRight  animated pr-30" data-animation="fadeInRight" data-delay=".4s">
              <div className="about-title second-title pb-25">
                <h5>About Us</h5>
                <h2>Most Safe &amp; Rated Hotel In London.</h2>
              </div>
              <p>Morbi tortor urna, placerat vel arcu quis, fringilla egestas neque. Morbi sit amet porta
                erat, quis rutrum risus. Vivamus et gravida nibh, quis posuere felis. In commodo mi
                lectus, Integer ligula lorem, finibus vitae lorem vitae tincidunt dolor consequat quis.
              </p>
              <p>Cras finibus laoreet felis et hendrerit. Integer ligula lorem, finibus vitae lorem at,
                egestas consectetur urna. Integer id ultricies elit. Maecenas sodales nibh, quis posuere
                felis. In commodo mi lectus venenatis metus eget fringilla. Suspendisse varius ante eget
                lorem tempus blandit. Aenean eu vulputate lorem, quis auctor lectus.</p>
              <div className="about-content3 mt-30">
                <div className="row justify-content-center align-items-center">
                  <div className="col-md-12">
                    <ul className="green mb-30">
                      <li> 24 Month / 24,000km Nationwide Warranty monotone</li>
                      <li> Curabitur dapibus nisl a urna congue, in pharetra urna accumsan.</li>
                      <li> Customer Rewards Program and excellent technology</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <div className="slider-btn">
                      <Link to="/about" className="btn ss-btn smoth-scroll">Discover More</Link>
                    </div>
                  </div>
                  <div className="col-md-6 text-right">
                    <div className="signature">
                      <img src={signature} alt="img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="s-about-img p-relative  wow fadeInLeft animated" data-animation="fadeInLeft" data-delay=".4s">
              <img src={aboutImg02} alt="img" />
              <div className="about-icon">
                <img src={aboutImg03} alt="img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default AboutArea5