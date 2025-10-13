import { Link } from 'react-router-dom'
import singleRoom01 from '../../assets/img/bg/single-room-img01.png'
import singleRoom02 from '../../assets/img/bg/single-room-img02.png'
import singleRoom03 from '../../assets/img/bg/single-room-img03.png'
import reviewIcon from '../../assets/img/testimonial/review-icon.png'

const ServiceDetailsArea = () => {
  return (
    <div className="about-area5 about-p p-relative">
      <div className="container pt-120 pb-40">
        <div className="row">
          {/* #right side */}
          <div className="col-sm-12 col-md-12 col-lg-4 order-2">
            <aside className="sidebar services-sidebar">
              {/* Category Widget */}
              <div className="sidebar-widget categories">
                <div className="widget-content">
                  <h2 className="widget-title">  Book A Room</h2>
                  {/* Services Category */}
                  {/* booking-area */}
                  <div className="booking">
                    <div className="contact-bg">
                      <form action="https://htmldemo.zcubethemes.com/riorelax/mail.php" method="post" className="contact-form mt-30">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="contact-field p-relative c-name mb-20">
                              <label><i className="fal fa-badge-check" /> Check In Date</label>
                              <input type="date" id="chackin" name="date" />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="contact-field p-relative c-subject mb-20">
                              <label><i className="fal fa-times-octagon" /> Check Out Date</label>
                              <input type="date" id="chackout" name="date" />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="contact-field p-relative c-subject mb-20">
                              <label><i className="fal fa-users" /> Adults</label>
                              <select name="adults" id="adu">
                                <option value="sports-massage">Adults</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="contact-field p-relative c-option mb-20">
                              <label><i className="fal fa-concierge-bell" /> Room</label>
                              <select name="room" id="rm">
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
                            <div className="slider-btn mt-15">
                              <button className="btn ss-btn" data-animation="fadeInRight" data-delay=".8s"><span>Book Table Now</span></button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  {/* booking-area-end */}
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
          <div className="col-lg-8 col-md-12 col-sm-12 order-1">
            <div className="service-detail">
              {/* Two Column */}
              <div className="two-column">
                <div className="row">
                  <div className="image-column col-xl-6 col-lg-12 col-md-12">
                    <figure className="image"><img src={singleRoom01} alt="" /></figure>
                  </div>
                  <div className="text-column col-xl-6 col-lg-12 col-md-12">
                    <figure className="image"><img src={singleRoom02} alt="" /></figure>
                    <figure className="image"><img src={singleRoom03} alt="" /></figure>
                  </div>
                </div>
              </div>
              <div className="content-box">
                <div className="row align-items-center mb-50">
                  <div className="col-lg-6 col-md-6">
                    <div className="price">
                      <h2>Double Room</h2>
                      <span>$400/Night</span>
                    </div>
                  </div>
                  <div className="col-lg-6 text-right">
                    <img src={reviewIcon} alt="img" />
                  </div>
                </div>
                <p>Understated seaside elegance, traditional grace, complemented by warm homely touches and pops of modern flair, Rest Detail Hotel Hua Hin
                  invites you to discover our exquisitely designed resort set in a peaceful enclave just out of Hua Hin town. A charming setting, spacious yet incredibly cozy rooms, luxurious two – four bedroom Pavilions with private swimming pools. Recreational facilities to help you relax, delicious local and European dishes delicately plated for you to taste, meticulously put together for you to have the perfect break.</p>
                <p>Interdum et malesu they adamale fames ac anteipsu pimsine faucibus curabitur arcu site feugiat in tortor in, volutpat sollicitudin libero. Hotel non lorem acer suscipit bibendum vulla facilisi nedeuter nunc volutpa mollis sapien velet conseyer turpeutionyer masin libero sempe mollis.</p>
                <h3>Room Feature.</h3>
                <ul className="room-features d-flex align-items-center">
                  <li>
                    <i className="fal fa-tv-retro" /> TV
                  </li>
                  <li>
                    <i className="fal fa-wifi" /> Free Wifi
                  </li>
                  <li>
                    <i className="fal fa-air-conditioner" /> Air Condition
                  </li>
                  <li>
                    <i className="fal fa-dumpster-fire" /> Heater
                  </li>
                  <li>
                    <i className="fal fa-phone-rotary" /> Phone
                  </li>
                  <li>
                    <i className="fal fa-dryer-alt" /> Laundry
                  </li>
                  <li>
                    <i className="fal fa-user" /> Adults: 2
                  </li>
                  <li>
                    <i className="fal fa-square" /> Size: 24m²
                  </li>
                  <li>
                    <i className="fal fa-bed" /> Bed Type: One bed
                  </li>
                </ul>
                <div className="mb-50">
                  <Link to="/booking" className="btn ss-btn">Book This Room</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetailsArea