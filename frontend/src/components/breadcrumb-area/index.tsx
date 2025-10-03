import { Link } from 'react-router-dom';
import bdrc from '../../assets/img/bg/bdrc-bg.jpg';

const BreadcrumbArea = (props: { title: string, tag: string }) => {
  return (
    <section className="breadcrumb-area d-flex align-items-center" style={{ backgroundImage: `url(${bdrc})` }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-12 col-lg-12">
            <div className="breadcrumb-wrap text-center">
              <div className="breadcrumb-title">
                <h2>{props.title}</h2>
                <div className="breadcrumb-wrap">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                      <li className="breadcrumb-item active" aria-current="page">{props.tag}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BreadcrumbArea;