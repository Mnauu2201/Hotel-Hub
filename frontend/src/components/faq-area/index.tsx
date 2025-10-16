const FaqArea = () => {
  return (
    <section id="faq" className="faq-area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="faq-wrap">
              <div className="accordion" id="accordionExample">
                <div className="card">
                  <div className="card-header" id="headingOne">
                    <h2 className="mb-0">
                      <button className="faq-btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                        Làm thế nào để đặt phòng trực tuyến?
                      </button>
                    </h2>
                  </div>
                  <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample" style={{}}>
                    <div className="card-body">
                      Bạn có thể đặt phòng trực tuyến bằng cách chọn ngày nhận/trả phòng, số lượng khách, sau đó chọn phòng phù hợp và điền thông tin liên hệ. Hệ thống sẽ gửi email xác nhận đặt phòng cho bạn.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingTwo">
                    <h2 className="mb-0">
                      <button className="faq-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                        Chính sách hủy đặt phòng như thế nào?
                      </button>
                    </h2>
                  </div>
                  <div id="collapseTwo" className="collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample" style={{}}>
                    <div className="card-body">
                      Bạn có thể hủy đặt phòng miễn phí trước 24 giờ ngày nhận phòng. Sau thời gian này, phí hủy sẽ được tính theo chính sách của khách sạn. Vui lòng liên hệ hotline để được hỗ trợ.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingThree">
                    <h2 className="mb-0">
                      <button className="faq-btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                        Khách sạn có những tiện nghi gì?
                      </button>
                    </h2>
                  </div>
                  <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample" style={{}}>
                    <div className="card-body">
                      Khách sạn có đầy đủ tiện nghi hiện đại như WiFi miễn phí, điều hòa, TV, minibar, ban công, hướng biển, spa, gym, nhà hàng, quầy bar và dịch vụ phòng 24/7.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingFour">
                    <h2 className="mb-0">
                      <button className="faq-btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                        Có thể thay đổi ngày đặt phòng không?
                      </button>
                    </h2>
                  </div>
                  <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                    <div className="card-body">
                      Có, bạn có thể thay đổi ngày đặt phòng thông qua tài khoản cá nhân hoặc liên hệ hotline. Tuy nhiên, việc thay đổi phụ thuộc vào tình trạng phòng trống và có thể phát sinh phí bổ sung.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="faq-wrap">
              <div className="accordion" id="accordionExample1">
                <div className="card">
                  <div className="card-header" id="headingfive">
                    <h2 className="mb-0">
                      <button className="faq-btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsefive">
                        Phương thức thanh toán nào được chấp nhận?
                      </button>
                    </h2>
                  </div>
                  <div id="collapsefive" className="collapse" aria-labelledby="headingfive" data-bs-parent="#accordionExample1" style={{}}>
                    <div className="card-body">
                      Chúng tôi chấp nhận thanh toán bằng thẻ tín dụng/ghi nợ (Visa, Mastercard), chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay) và thanh toán trực tiếp tại khách sạn.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingSix">
                    <h2 className="mb-0">
                      <button className="faq-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix">
                        Thời gian check-in và check-out là khi nào?
                      </button>
                    </h2>
                  </div>
                  <div id="collapseSix" className="collapse show" aria-labelledby="headingSix" data-bs-parent="#accordionExample" style={{}}>
                    <div className="card-body">
                      Thời gian check-in từ 14:00 và check-out trước 12:00. Nếu bạn đến sớm hoặc muốn check-out muộn, vui lòng liên hệ lễ tân để được hỗ trợ tùy theo tình trạng phòng trống.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingSeveen">
                    <h2 className="mb-0">
                      <button className="faq-btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeveen">
                        Khách sạn có dịch vụ đưa đón sân bay không?
                      </button>
                    </h2>
                  </div>
                  <div id="collapseSeveen" className="collapse" aria-labelledby="headingSeveen" data-bs-parent="#accordionExample" style={{}}>
                    <div className="card-body">
                      Có, chúng tôi cung cấp dịch vụ đưa đón sân bay với xe riêng và tài xế chuyên nghiệp. Vui lòng đặt trước ít nhất 24 giờ và liên hệ lễ tân để được hỗ trợ chi tiết.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingEighte">
                    <h2 className="mb-0">
                      <button className="faq-btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEighte">
                        Có thể mang thú cưng vào khách sạn không?
                      </button>
                    </h2>
                  </div>
                  <div id="collapseEighte" className="collapse" aria-labelledby="headingEighte" data-bs-parent="#accordionExample">
                    <div className="card-body">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FaqArea