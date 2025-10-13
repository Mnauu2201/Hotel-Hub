import team01 from '../../assets/img/team/team01.jpg'
import portfolioImg02 from '../../assets/img/gallery/protfolio-img02.png'
import portfolioImg03 from '../../assets/img/gallery/protfolio-img03.png'
import { useEffect } from "react";
import $ from "jquery";

const TeamArea3 = () => {
  useEffect(() => {
    $(".skill-per").each(function () {
      const $this = $(this);
      const id = $this.attr("id");
      $this.css("width", "0%"); 
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
    <section className="team-area-content">
      <div className="container">
        {/* Lower Content */}
        <div className="lower-content">
          <div className="row">
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="team-img-box">
                <img src={team01} alt="img" />
              </div>
              <div className="per-info">
                <h4>Personal Info</h4>
                <ul>
                  <li>
                    <div className="icon"><i className="fal fa-envelope" /> <strong>Email</strong></div>
                    <div className="text">info@webexample.com</div>
                  </li>
                  <li>
                    <div className="icon"><i className="fal fa-phone" /> <strong>Phone</strong></div>
                    <div className="text">980-786-098-09</div>
                  </li>
                  
                </ul>
              </div>
            </div>
            <div className="text-column col-lg-8 col-md-12 col-sm-12">
              <div className="s-about-content pl-30 wow fadeInRight" data-animation="fadeInRight" data-delay=".2s">
                <p>Pleasure and praising pain was born and I will give you a complete account of the systems, and expound the actually teachings of the great explorer of the truth, the master-builder of human uts happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally Nor who loves or pursues or desires to obtain pain of itself.</p>
                <p>Tempor nonummy metus lobortis. Sociis velit etiam, dapibus lectus vehicula pele llentesque cras pat fusce pharetra felis sapien varius Integer dis ads se purus sollicitudin dapibus et vivamus pharetra sit integer dictum in dise natoque an mus quis in. Facilisis inceptos nec, potenti nostra aenean lacinia varius semper ant nullam nulla primis placerat facilisis. Netus lorem rutrum arcu dignissim at sit morbi phasellus nascetur eget urna potenti cum vestibulum cras. </p>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="skills-content s-about-content mt-20">
                      <div className="skills">
                        <div className="skill mb-30">
                          <div className="skill-name">Design</div>
                          <div className="skill-bar">
                            <div className="skill-per" id={"80"} />
                          </div>
                        </div>
                        <div className="skill mb-30">
                          <div className="skill-name">Easy Manage</div>
                          <div className="skill-bar">
                            <div className="skill-per" id={"90"} />
                          </div>
                        </div>
                        <div className="skill mb-30">
                          <div className="skill-name">Project Organize</div>
                          <div className="skill-bar">
                            <div className="skill-per" id={"70"} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="two-column mt-30">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamArea3