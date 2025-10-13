import { Link } from 'react-router-dom';
import team1 from '../../assets/img/team/team01.jpg';
import team2 from '../../assets/img/team/team02.jpg';
import team3 from '../../assets/img/team/team03.jpg';
import team4 from '../../assets/img/team/team04.jpg';


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
                <h4><Link to="#">Nguyễn Minh Khánh</Link></h4>
                <p>Frontend</p>
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
                <h4><Link to="#">Phạm Chí Dững</Link></h4>
                <p>Frontend</p>
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
                <h4><Link to="#">Nguyễn Quang Anh</Link></h4>
                <p>Backend</p>
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
                <h4><Link to="#">Phạm Đức Anh</Link></h4>
                <p>Backend</p>
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