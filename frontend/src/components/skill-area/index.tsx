import { useEffect } from "react";
import $ from "jquery";
import anImg05 from '../../assets/img/bg/an-img-05.png';
import skillsImg from '../../assets/img/bg/skills-img.png';

const SkillArea = () => {
  useEffect(() => {
    $(".skill-per").each(function () {
      const $this = $(this);
      const id = $this.attr("id");
      $this.css("width", "0%"); // bắt đầu từ 0
      $({ animatedValue: 0 }).animate(
        { animatedValue: id },
        {
          duration: 1000,
          step: function () {
            $this.css("width", Math.floor(this.animatedValue) + "%");
          },
          complete: function () {
            $this.css("width", Math.floor(this.animatedValue) + "%");
          }
        }
      );
    });
  }, []);

  return (
    <section id="skill" className="skill-area p-relative fix" style={{ background: '#291d16' }}>
      <div className="animations-01">
        <img src={anImg05} alt="contact-bg-an-05" />
      </div>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="skills-content s-about-content">
              <div className="skills-title pb-20">
                <h5>Rio We Use</h5>
                <h2>We Offer Wide Selection of Hotel</h2>
              </div>
              <p>Vestibulum non ornare nunc. Maecenas a metus in est iaculis pretium. Aliquam ullamcorper nibh lacus, ac suscipit ipsum consequat porttitor.</p>
              <div className="skills-content s-about-content mt-20">
                <div className="skills">
                  <div className="skill mb-30">
                    <div className="skill-name">Quality Production</div>
                    <div className="skill-bar">
                      <div className="skill-per" id="80" />
                    </div>
                  </div>
                  <div className="skill mb-30">
                    <div className="skill-name">Maintenance Services</div>
                    <div className="skill-bar">
                      <div className="skill-per" id="90" />
                    </div>
                  </div>
                  <div className="skill mb-30">
                    <div className="skill-name">Product Management</div>
                    <div className="skill-bar">
                      <div className="skill-per" id="70" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 pr-30">
            <div className="skills-img wow fadeInRight animated" data-animation="fadeInRight" data-delay=".4s">
              <img src={skillsImg} alt="img" className="img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillArea;
