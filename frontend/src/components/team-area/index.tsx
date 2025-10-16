import { useEffect } from "react";
import $ from "jquery";
import "slick-carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import team1 from '../../assets/img/team/team01.jpg';
import team2 from '../../assets/img/team/team02.jpg';
import team3 from '../../assets/img/team/team03.jpg';
import team4 from '../../assets/img/team/team04.jpg';
import team5 from '../../assets/img/team/team05.jpg';
import { Link } from "react-router-dom";

const TeamArea = () => {
  useEffect(() => {
    const $team = $(".team-active");

    $team.slick({
      dots: true,
      infinite: true,
      arrows: false,
      prevArrow: '<button type="button" class="slick-prev"><i class="far fa-chevron-left"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="far fa-chevron-right"></i></button>',
      speed: 1000,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true, dots: true } },
        { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });

    return () => {
      if ($team.hasClass('slick-initialized')) {
        $team.slick('unslick'); // cleanup khi component unmount
      }
    };
  }, []);

  const teamMembers = [
    { img: team1, name: 'Nguyễn Văn Minh', role: 'Giám đốc khách sạn' },
    { img: team2, name: 'Trần Thị Lan', role: 'Quản lý lễ tân' },
    { img: team3, name: 'Lê Văn Hùng', role: 'Quản lý dịch vụ' },
    { img: team4, name: 'Phạm Thị Mai', role: 'Quản lý nhà hàng' },
    { img: team5, name: 'Hoàng Văn Đức', role: 'Quản lý kỹ thuật' },
  ];

  return (
    <section className="team-area2 fix p-relative pt-105 pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center mb-40">
            <div className="section-title">
              <h5>Đội ngũ của chúng tôi</h5>
              <h2>Chuyên gia khách sạn hàng đầu</h2>
              <p>Đội ngũ nhân viên chuyên nghiệp, nhiệt tình và giàu kinh nghiệm, luôn sẵn sàng phục vụ quý khách với tiêu chuẩn cao nhất.</p>
            </div>
          </div>
        </div>
        <div className="row team-active">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="col-xl-4 col-md-6">
              <div className="single-team mb-40">
                <div className="team-thumb brd">
                  <img src={member.img} alt={member.name} />
                </div>
                <div className="team-info">
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                  <div className="team-social">
                    <ul>
                      <li><Link to="#"><i className="fab fa-facebook-f" /></Link></li>
                      <li><Link to="#"><i className="fab fa-twitter" /></Link></li>
                      <li><Link to="#"><i className="fab fa-instagram" /></Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamArea;
