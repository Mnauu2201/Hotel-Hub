import { Link } from 'react-router-dom';
import team1 from '../../assets/img/team/team01.jpg';
import team2 from '../../assets/img/team/team02.jpg';
import team3 from '../../assets/img/team/team03.jpg';
import team4 from '../../assets/img/team/team04.jpg';
import team5 from '../../assets/img/team/team05.png';
import team6 from '../../assets/img/team/team06.png';
import team7 from '../../assets/img/team/team07.png';
import team8 from '../../assets/img/team/team08.png';

const TeamArea2 = () => {
  return (
    <section className="team-area fix p-relative pt-120 pb-90">
      <div className="container">
        <div className="row">
          <div className="col-xl-3">
            <div className="single-team mb-45">
              <div className="team-thumb">
                <div className="brd">
                  <img src={team1} alt="img" />
                </div>
              </div>
              <div className="team-info">
                <h4><Link to="/team-detail">Bableo Dablo</Link></h4>
                <p>Worker</p>
                <div className="team-social">
                  <ul>
                    <li><Link to="#"><i className="fab fa-facebook-f" /></Link></li>
                    <li> <Link to="#"><i className="fab fa-twitter" /></Link></li>
                    <li><Link to="#"><i className="fab fa-instagram" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="single-team mb-45">
              <div className="team-thumb">
                <div className="brd">
                  <img src={team2} alt="img" />
                </div>
              </div>
              <div className="team-info">
                <h4><Link to="/team-detail">Dawon Crisen</Link></h4>
                <p>Worker</p>
                <div className="team-social">
                  <ul>
                    <li><Link to="#"><i className="fab fa-facebook-f" /></Link></li>
                    <li> <Link to="#"><i className="fab fa-twitter" /></Link></li>
                    <li><Link to="#"><i className="fab fa-instagram" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="single-team mb-45">
              <div className="team-thumb">
                <div className="brd">
                  <img src={team3} alt="img" />
                </div>
              </div>
              <div className="team-info">
                <h4><Link to="/team-detail">David Suarez</Link></h4>
                <p>Worker</p>
                <div className="team-social">
                  <ul>
                    <li><Link to="#"><i className="fab fa-facebook-f" /></Link></li>
                    <li> <Link to="#"><i className="fab fa-twitter" /></Link></li>
                    <li><Link to="#"><i className="fab fa-instagram" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="single-team mb-45">
              <div className="team-thumb">
                <div className="brd">
                  <img src={team4} alt="img" />
                </div>
              </div>
              <div className="team-info">
                <h4><Link to="/team-detail">Gerard Peano</Link></h4>
                <p>Worker</p>
                <div className="team-social">
                  <ul>
                    <li><Link to="#"><i className="fab fa-facebook-f" /></Link></li>
                    <li> <Link to="#"><i className="fab fa-twitter" /></Link></li>
                    <li><Link to="#"><i className="fab fa-instagram" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="single-team mb-45">
              <div className="team-thumb">
                <div className="brd">
                  <img src={team5} alt="img" />
                </div>
              </div>
              <div className="team-info">
                <h4><Link to="/team-detail">Ostin Green</Link></h4>
                <p>Worker</p>
                <div className="team-social">
                  <ul>
                    <li><Link to="#"><i className="fab fa-facebook-f" /></Link></li>
                    <li> <Link to="#"><i className="fab fa-twitter" /></Link></li>
                    <li><Link to="#"><i className="fab fa-instagram" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="single-team mb-45">
              <div className="team-thumb">
                <div className="brd">
                  <img src={team6} alt="img" />
                </div>
              </div>
              <div className="team-info">
                <h4><Link to="/team-detail">Norman Colins</Link></h4>
                <p>Worker</p>
                <div className="team-social">
                  <ul>
                    <li><Link to="#"><i className="fab fa-facebook-f" /></Link></li>
                    <li> <Link to="#"><i className="fab fa-twitter" /></Link></li>
                    <li><Link to="#"><i className="fab fa-instagram" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="single-team mb-45">
              <div className="team-thumb">
                <div className="brd">
                  <img src={team7} alt="img" />
                </div>
              </div>
              <div className="team-info">
                <h4><Link to="/team-detail">Ostin Green</Link></h4>
                <p>Worker</p>
                <div className="team-social">
                  <ul>
                    <li><Link to="#"><i className="fab fa-facebook-f" /></Link></li>
                    <li> <Link to="#"><i className="fab fa-twitter" /></Link></li>
                    <li><Link to="#"><i className="fab fa-instagram" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="single-team mb-45">
              <div className="team-thumb">
                <div className="brd">
                  <img src={team8} alt="img" />
                </div>
              </div>
              <div className="team-info">
                <h4><Link to="/team-detail">Norman Colins</Link></h4>
                <p>Worker</p>
                <div className="team-social">
                  <ul>
                    <li><Link to="#"><i className="fab fa-facebook-f" /></Link></li>
                    <li> <Link to="#"><i className="fab fa-twitter" /></Link></li>
                    <li><Link to="#"><i className="fab fa-instagram" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default TeamArea2