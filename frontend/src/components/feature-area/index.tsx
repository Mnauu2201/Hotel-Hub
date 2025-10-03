import { Link } from 'react-router-dom'
import anImg02 from '../../assets/img/bg/an-img-02.png'
import featureImg from '../../assets/img/features/feature.png'

const FeatureArea = () => {
  return (
    <section className="feature-area2 p-relative fix" style={{ background: '#f7f5f1' }}>
      <div className="animations-02"><img src={anImg02} alt="contact-bg-an-05" /></div>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 col-md-12 col-sm-12 pr-30">
            <div className="feature-img">
              <img src={featureImg} alt="img" className="img" />
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="feature-content s-about-content">
              <div className="feature-title pb-20">
                <h5>Luxury Hotel &amp; Resort</h5>
                <h2>
                  Pearl Of The Adriatic.
                </h2>
              </div>
              <p>Vestibulum non ornare nunc. Maecenas a metus in est iaculis pretium. Aliquam ullamcorper nibh lacus, ac suscipit ipsum consequat porttitor.Aenean vehicula ligula eu rhoncus porttitor. Duis vel lacinia quam. Nunc rutrum porta ex, in imperdiet tortor feugiat at.</p>
              <p>Cras finibus laoreet felis et hendrerit. Integer ligula lorem, finibus vitae lorem at, egestas consectetur urna. Integer id ultricies elit. Maecenas sodales nibh, quis posuere felis. In commodo mi lectus venenatis metus eget fringilla. Suspendisse varius ante eget.</p>
              <div className="slider-btn mt-15">
                <Link to="/about" className="btn ss-btn smoth-scroll">Discover More</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureArea