import blogDetail1 from "../../assets/img/blog/b_details01.jpg"
import blogDetail2 from "../../assets/img/blog/b_details02.jpg"
import blogDetail3 from "../../assets/img/blog/b_details03.jpg"
import blogDetail4 from "../../assets/img/blog/b_details04.jpg"
import comment1 from "../../assets/img/blog/comment/c_01.png"
import comment2 from "../../assets/img/blog/comment/c_02.png"
import comment3 from "../../assets/img/blog/comment/c_03.png"
import c_d01 from "../../assets/img/icon/c_d01.png"
import avatar from "../../assets/img/blog/comment/avatar.png"
import { Link } from "react-router-dom"

const InnerBlog2 = () => {
  return (
    <>
    <section className="inner-blog b-details-p pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="blog-details-wrap">
                <div className="details__content pb-30">
                  <h2>With our vastly improved notifications system, users
                    have more control.</h2>
                  <div className="meta-info">
                    <ul>
                      <li><i className="fal fa-eye" /> 100 Views</li>
                      <li><i className="fal fa-comments" /> 35 Comments</li>
                      <li><i className="fal fa-calendar-alt" /> 24th March 2019</li>
                    </ul>
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo amet set for your cool happiness for lyour loyal city.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deser unt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusant ium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit asperna tur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisq.</p>
                  <blockquote>
                    <footer>By Rosalina Pong</footer>
                    <h3>Viral dreamcatcher keytar typewriter, aest hetic offal umami. Aesthetic polaroid pug pitchfork post-ironic.</h3>
                  </blockquote>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deser unt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusant.</p>
                  <div className="details__content-img">
                    <img src={blogDetail1} alt="" />
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deser unt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusan tium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi archi tecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit asperna tur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non num quam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Lorem ipsum dolor sit amet,consectetur adipisicing elit, sed do eiusmod incididunt.</p>
                  <figure>
                    <img src={blogDetail2} alt="" />
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna ali qua. Ut enim ad minim veniam, quis nostrud exercitation ulla mco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupida tat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  </figure>
                  <div className="row">
                    <div className="col-xl-12 col-md-12">
                      <div className="post__tag">
                        <h5>Releted Tags</h5>
                        <ul>
                          <li><Link to="#">organic</Link></li>
                          <li><Link to="#">Foods</Link></li>
                          <li><Link to="#">tasty</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="posts_navigation pt-35 pb-35">
                  <div className="row align-items-center">
                    <div className="col-xl-4 col-md-5">
                      <div className="prev-link">
                        <span>Prev Post</span>
                        <h4><Link to="#">Tips Minimalist</Link></h4>
                      </div>
                    </div>
                    <div className="col-xl-4 col-md-2 text-left text-md-center">
                      <Link to="/blog" className="blog-filter"><img src={c_d01} alt="" /></Link>
                    </div>
                    <div className="col-xl-4 col-md-5">
                      <div className="next-link text-left text-md-right">
                        <span>next Post</span>
                        <h4><Link to="#">Less Is More</Link></h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="related__post mt-45 mb-85">
                  <div className="post-title">
                    <h4>Related Post</h4>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="related-post-wrap mb-30">
                        <div className="post-thumb">
                          <img src={blogDetail3} alt="" />
                        </div>
                        <div className="rp__content">
                          <h3><Link to="#">Auis nostrud exercita ullamco laboris nisi ut</Link></h3>
                          <p>Lorem ipsum dolor sit amet, consectet ur adipisicing elit, sed do eiusmod temp or
                            incididunt ut labore et dolore.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="related-post-wrap mb-30">
                        <div className="post-thumb">
                          <img src={blogDetail4} alt="" />
                        </div>
                        <div className="rp__content">
                          <h3><Link to="#">Excepteur sint occaecat cupida tat non proident</Link></h3>
                          <p>Lorem ipsum dolor sit amet, consectet ur adipisicing elit, sed do eiusmod temp or
                            incididunt ut labore et dolore.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="avatar__wrap text-center mb-45">
                  <div className="avatar-img">
                    <img src={avatar} alt="" />
                  </div>
                  <div className="avatar__info">
                    <h5>Rosalina William</h5>
                    <div className="avatar__info-social">
                      <Link to="#"><i className="fab fa-facebook-f" /></Link>
                      <Link to="#"><i className="fab fa-twitter" /></Link>
                      <Link to="#"><i className="fab fa-instagram" /></Link>
                      <Link to="#"><i className="fab fa-behance" /></Link>
                      <Link to="#"><i className="fab fa-linkedin" /></Link>
                    </div>
                  </div>
                  <div className="avatar__wrap-content">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                      et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequa aute irure dolor.</p>
                  </div>
                </div>
                <div className="comment__wrap pb-45">
                  <div className="comment__wrap-title">
                    <h5>Comments</h5>
                  </div>
                  <div className="single__comment mb-35">
                    <div className="comments-avatar">
                      <img src={comment1} alt="" />
                    </div>
                    <div className="comment-text">
                      <div className="avatar-name mb-15">
                        <h6>ALina Kelian</h6>
                        <span>19th May 2021</span>
                      </div>
                      <p>The bee's knees bite your arm off bits and bobs he nicked it gosh gutted mate blimey, old off his nut argy bargy vagabond buggered dropped.</p>
                      <Link to="#" className="comment-reply mt-15"><i className="fas fa-reply" /> Reply</Link>
                    </div>
                  </div>
                  <div className="single__comment children mb-35">
                    <div className="comments-avatar">
                      <img src={comment2} alt="" />
                    </div>
                    <div className="comment-text">
                      <div className="avatar-name mb-15">
                        <h6>Rlex Kelian <i className="fas fa-bookmark" /></h6>
                        <span>19th May 2021</span>
                      </div>
                      <p>Do one say wind up buggered bobby bite your arm off gutted mate, David victoria sponge cup of char chap fanny around.</p>
                      <Link to="#" className="comment-reply mt-15"><i className="fas fa-reply" /> Reply</Link>
                    </div>
                  </div>
                  <div className="single__comment">
                    <div className="comments-avatar">
                      <img src={comment3} alt="" />
                    </div>
                    <div className="comment-text">
                      <div className="avatar-name mb-15">
                        <h6>Roboto Alex</h6>
                        <span>21th May 2021</span>
                      </div>
                      <p>Baking cakes is cobblers wellies William geeza bits and bobs what a plonker it's your round,</p>
                      <Link to="#" className="comment-reply mt-15"><i className="fas fa-reply" /> Reply</Link>
                    </div>
                  </div>
                </div>
                <div id="comments" className="comments-area  mt-45">
                  <div id="respond" className="comment-respond">
                    <h3 id="reply-title" className="comment-reply-title">Leave a Reply <small><Link rel="nofollow" id="cancel-comment-reply-link" to="https://htmldemo.zcubethemes.com/finco/?p=2112#respond" style={{display: 'none'}}>Cancel reply</Link></small></h3>
                    <form action="http://wordpress.zcube.in/finco/wp-comments-post.php" method="post" id="commentform" className="comment-form" noValidate>
                      <p className="comment-notes"><span id="email-notes">Your email address will not be published.</span> Required fields are marked <span className="required">*</span></p>
                      <p className="comment-field"><i className="fas fa-user" /><input id="author" placeholder="Your Name" name="author" type="text" /></p>
                      <p className="comment-field"><i className="fas fa-envelope" /><input id="email" placeholder="your-real-email@example.com" name="email" type="text" /></p>
                      <p className="comment-field"><i className="fas fa-globe" /><input id="url" name="url" placeholder="http://your-site-name.com" type="text" /> </p>
                      <p className="comment-form-comment"><label htmlFor="comment">Comment</label> <textarea id="comment" name="comment" cols={45} rows={8} maxLength={65525} required={true} defaultValue={""} /></p>
                      <p className="form-submit"><input name="submit" type="submit" id="submit" className="submit" defaultValue="Post Comment" /> <input type="hidden" name="comment_post_ID" defaultValue={2112} id="comment_post_ID" />
                        <input type="hidden" name="comment_parent" id="comment_parent" defaultValue={0} />
                      </p>
                    </form>
                  </div>
                  {/* #respond */}
                </div>
              </div>
            </div>
            {/* #right side */}
            <div className="col-sm-12 col-md-12 col-lg-4">
              <aside className="sidebar-widget">
                <section id="search-3" className="widget widget_search">
                  <h2 className="widget-title">Search</h2>
                  <form role="search" method="get" className="search-form" action="http://wordpress.zcube.in/finco/">
                    <label>
                      <span className="screen-reader-text">Search for:</span>
                      <input type="search" className="search-field" placeholder="Search …"  name="s" />
                    </label>
                    <input type="submit" className="search-submit" defaultValue="Search" />
                  </form>
                </section>
                <section id="custom_html-5" className="widget_text widget widget_custom_html">
                  <h2 className="widget-title">Follow Us</h2>
                  <div className="textwidget custom-html-widget">
                    <div className="widget-social">
                      <Link to="#"><i className="fab fa-twitter" /></Link>
                      <Link to="#"><i className="fab fa-pinterest-p" /></Link>
                      <Link to="#"><i className="fab fa-facebook-f" /></Link>
                      <Link to="#"><i className="fab fa-instagram" /></Link>
                      <Link to="#"><i className="fab fa-wordpress" /></Link>
                    </div>
                  </div>
                </section>
                <section id="categories-1" className="widget widget_categories">
                  <h2 className="widget-title">Categories</h2>
                  <ul>
                    <li className="cat-item cat-item-16"><Link to="#">Branding</Link> (4)</li>
                    <li className="cat-item cat-item-23"><Link to="#">Corporat</Link> (3)</li>
                    <li className="cat-item cat-item-18"><Link to="#">Design</Link> (3)</li>
                    <li className="cat-item cat-item-22"><Link to="#">Gallery</Link> (3)</li>
                  </ul>
                </section>
                <section id="recent-posts-4" className="widget widget_recent_entries">
                  <h2 className="widget-title">Recent Posts</h2>
                  <ul>
                    <li>
                      <Link to="#">User Experience Psychology And Performance Smshing</Link>
                      <span className="post-date">August 19, 2020</span>
                    </li>
                    <li>
                      <Link to="#">Monthly Web Development Up Cost Of JavaScript</Link>
                      <span className="post-date">August 19, 2020</span>
                    </li>
                    <li>
                      <Link to="#">There are many variation passages of like available.</Link>
                      <span className="post-date">August 19, 2020</span>
                    </li>
                  </ul>
                </section>
                <section id="tag_cloud-1" className="widget widget_tag_cloud">
                  <h2 className="widget-title">Tag</h2>
                  <div className="tagcloud">
                    <Link to="#" className="tag-cloud-link tag-link-28 tag-link-position-1" style={{fontSize: '8pt'}} aria-label="app (1 item)">app</Link>
                    <Link to="#" className="tag-cloud-link tag-link-17 tag-link-position-2" style={{fontSize: '8pt'}} aria-label="Branding (1 item)">Branding</Link>
                    <Link to="#" className="tag-cloud-link tag-link-20 tag-link-position-3" style={{fontSize: '8pt'}} aria-label="corporat (1 item)">corporat</Link>
                    <Link to="#" className="tag-cloud-link tag-link-24 tag-link-position-4" style={{fontSize: '16.4pt'}} aria-label="Design (2 items)">Design</Link>
                    <Link to="#" className="tag-cloud-link tag-link-25 tag-link-position-5" style={{fontSize: '22pt'}} aria-label="gallery (3 items)">gallery</Link>
                    <Link to="#" className="tag-cloud-link tag-link-26 tag-link-position-6" style={{fontSize: '8pt'}} aria-label="video (1 item)">video</Link>
                    <Link to="#" className="tag-cloud-link tag-link-29 tag-link-position-7" style={{fontSize: '16.4pt'}} aria-label="web design (2 items)">web design</Link>
                  </div>
                </section>
              </aside>
            </div>
            {/* #right side end */}
          </div>
        </div>
      </section>
    </>
  )
}

export default InnerBlog2