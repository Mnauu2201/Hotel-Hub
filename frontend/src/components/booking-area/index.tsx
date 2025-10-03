const BookingArea = () => {
  return (
    <div id="booking" className="booking-area p-relative">
      <div className="container">
        <form action="#" className="contact-form">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <ul>
                <li>
                  <div className="contact-field p-relative c-name">
                    <label><i className="fal fa-badge-check" /> Check In Date</label>
                    <input type="date" id="chackin" name="date" />
                  </div>
                </li>
                <li>
                  <div className="contact-field p-relative c-name">
                    <label><i className="fal fa-times-octagon" /> Check Out Date</label>
                    <input type="date" id="chackout" name="date" />
                  </div>
                </li>
                <li>
                  <div className="contact-field p-relative c-name">
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
                </li>
                <li>
                  <div className="contact-field p-relative c-name">
                    <label><i className="fal fa-baby" /> Child</label>
                    <select name="child" id="cld">
                      <option value="sports-massage">Child</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div className="contact-field p-relative c-name">
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
                </li>
                <li>
                  <div className="slider-btn">
                    <label><i className="fal fa-calendar-alt" /></label>
                    <button className="btn ss-btn" data-animation="fadeInRight" data-delay=".8s">Check Availability</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingArea