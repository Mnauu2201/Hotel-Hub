import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Header = () => (
    <header className="bg-white shadow">
        <div className="bg-gray-100 py-2 hidden md:block">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <div className="flex items-center">
                        <i className="far fa-clock mr-2"></i>
                        <span>Mon - Fri: 9:00 - 19:00 / Closed on Weekends</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-mobile-alt mr-2"></i>
                        <strong>+91 705 210-1786</strong>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <a href="#" className="text-gray-600"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="text-gray-600"><i className="fab fa-instagram"></i></a>
                    <a href="#" className="text-gray-600"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="text-gray-600"><i className="fab fa-youtube"></i></a>
                </div>
            </div>
        </div>
        <div className="container mx-auto py-4 flex items-center justify-between">
            <div>
                <a href="/"><img src="/img/logo/logo.png" alt="logo" className="h-12" /></a>
            </div>
            <nav className="hidden lg:flex space-x-6">
                <div className="relative group">
                    <a href="#" className="text-gray-800">Home</a>
                    <div className="absolute hidden group-hover:block bg-white shadow-md">
                        <a href="index-2.html" className="block px-4 py-2">Home Page 01</a>
                        <a href="index-3.html" className="block px-4 py-2">Home Page 02</a>
                        <a href="index-4.html" className="block px-4 py-2">Home Page Side Menu</a>
                        <a href="index-5.html" className="block px-4 py-2">Home Page Full Menu</a>
                    </div>
                </div>
                <a href="about.html" className="text-gray-800">About</a>
                <div className="relative group">
                    <a href="room.html" className="text-gray-800">Our Rooms</a>
                    <div className="absolute hidden group-hover:block bg-white shadow-md">
                        <a href="room.html" className="block px-4 py-2">Our Rooms</a>
                        <a href="single-rooms.html" className="block px-4 py-2">Rooms Details</a>
                    </div>
                </div>
                <div className="relative group">
                    <a href="services.html" className="text-gray-800">Facilities</a>
                    <div className="absolute hidden group-hover:block bg-white shadow-md">
                        <a href="services.html" className="block px-4 py-2">Services</a>
                        <a href="single-service.html" className="block px-4 py-2">Services Details</a>
                    </div>
                </div>
                <div className="relative group">
                    <a href="#" className="text-gray-800">Pages</a>
                    <div className="absolute hidden group-hover:block bg-white shadow-md">
                        <a href="projects.html" className="block px-4 py-2">Gallery</a>
                        <a href="faq.html" className="block px-4 py-2">Faq</a>
                        <a href="team.html" className="block px-4 py-2">Team</a>
                        <a href="team-single.html" className="block px-4 py-2">Team Details</a>
                        <a href="pricing.html" className="block px-4 py-2">Pricing</a>
                        <a href="shop.html" className="block px-4 py-2">Shop</a>
                        <a href="shop-details.html" className="block px-4 py-2">Shop Details</a>
                    </div>
                </div>
                <div className="relative group">
                    <a href="blog.html" className="text-gray-800">Blog</a>
                    <div className="absolute hidden group-hover:block bg-white shadow-md">
                        <a href="blog.html" className="block px-4 py-2">Blog</a>
                        <a href="blog-details.html" className="block px-4 py-2">Blog Details</a>
                    </div>
                </div>
                <a href="contact.html" className="text-gray-800">Contact</a>
            </nav>
            <a href="contact.html" className="hidden lg:block bg-yellow-500 text-white px-4 py-2 rounded">Reservation</a>
        </div>
    </header>
);

const Slider = () => (
    <section className="relative bg-gray-900">
        <div className="flex flex-col items-center justify-center h-96" style={{ backgroundImage: "url(img/slider/slider_bg.png)", backgroundSize: "cover" }}>
            <div className="container mx-auto text-center text-white">
                <h2 className="text-4xl font-bold mb-4">Enjoy A Luxury Experience</h2>
                <p className="mb-6">Donec vitae libero non enim placerat eleifend aliquam erat volutpat. Curabitur diam ex, dapibus purus sapien, cursus sed nisl tristique, commodo gravida lectus non.</p>
                <div className="flex justify-center space-x-4">
                    <a href="contact.html" className="bg-yellow-500 text-white px-6 py-3 rounded">Discover More</a>
                    <a href="https://www.youtube.com/watch?v=gyGsPlt06bo" className="text-white flex items-center"><i className="fas fa-play mr-2"></i> Intro Video</a>
                </div>
            </div>
        </div>
    </section>
);

const BookingForm = () => (
    <section className="py-12 bg-white">
        <div className="container mx-auto">
            <div className="flex flex-wrap justify-center">
                <div className="w-full">
                    <ul className="flex flex-wrap justify-center space-x-4">
                        <li className="mb-4">
                            <label className="flex items-center"><i className="fal fa-badge-check mr-2"></i> Check In Date</label>
                            <input type="date" className="border p-2 rounded" />
                        </li>
                        <li className="mb-4">
                            <label className="flex items-center"><i className="fal fa-times-octagon mr-2"></i> Check Out Date</label>
                            <input type="date" className="border p-2 rounded" />
                        </li>
                        <li className="mb-4">
                            <label className="flex items-center"><i className="fal fa-users mr-2"></i> Adults</label>
                            <select className="border p-2 rounded">
                                <option>Adults</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </li>
                        <li className="mb-4">
                            <label className="flex items-center"><i className="fal fa-baby mr-2"></i> Child</label>
                            <select className="border p-2 rounded">
                                <option>Child</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </li>
                        <li className="mb-4">
                            <label className="flex items-center"><i className="fal fa-concierge-bell mr-2"></i> Room</label>
                            <select className="border p-2 rounded">
                                <option>Room</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </li>
                        <li className="mb-4">
                            <button className="bg-yellow-500 text-white px-6 py-3 rounded">Check Availability</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

const About = () => (
    <section className="py-24 relative">
        <div className="container mx-auto flex flex-wrap items-center">
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                <img src="img/features/about_img_02.png" alt="about" className="w-full rounded" />
            </div>
            <div className="w-full lg:w-1/2 pl-4">
                <h5 className="text-yellow-500">About Us</h5>
                <h2 className="text-3xl font-bold mb-4">Most Safe & Rated Hotel In London.</h2>
                <p className="mb-4">Morbi tortor urna, placerat vel arcu quis, fringilla egestas neque. Morbi sit amet porta erat, quis rutrum risus.</p>
                <p className="mb-4">Cras finibus laoreet felis et hendrerit. Integer ligula lorem, finibus vitae lorem at, egestas consectetur urna.</p>
                <ul className="list-disc pl-5 mb-4">
                    <li>24 Month / 24,000km Nationwide Warranty monotone</li>
                    <li>Curabitur dapibus nisl a urna congue, in pharetra urna accumsan.</li>
                    <li>Customer Rewards Program and excellent technology</li>
                </ul>
                <div className="flex justify-between items-center">
                    <a href="about.html" className="bg-yellow-500 text-white px-6 py-3 rounded">Discover More</a>
                    <img src="img/features/signature.png" alt="signature" className="h-12" />
                </div>
            </div>
        </div>
    </section>
);

const Services = () => (
    <section className="py-24 bg-gray-100">
        <div className="container mx-auto text-center">
            <h5 className="text-yellow-500">Explore</h5>
            <h2 className="text-3xl font-bold mb-4">The Hotel</h2>
            <p className="mb-8">Proin consectetur non dolor vitae pulvinar. Pellentesque sollicitudin dolor eget neque viverra, sed interdum metus interdum.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: "Quality Room", icon: "img/icon/fe-icon01.png", link: "single-service.html" },
                    { title: "Private Beach", icon: "img/icon/fe-icon04.png", link: "single-service.html" },
                    { title: "Best Accommodation", icon: "img/icon/fe-icon05.png", link: "single-service.html" },
                    { title: "Wellness & Spa", icon: "img/icon/fe-icon06.png", link: "single-service.html" },
                    { title: "Restaurants & Bars", icon: "img/icon/fe-icon07.png", link: "single-service.html" },
                    { title: "Special Offers", icon: "img/icon/fe-icon08.png", link: "single-service.html" },
                ].map((service, index) => (
                    <div key={index} className="bg-white p-6 rounded shadow">
                        <img src={service.icon} alt="icon" className="h-12 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold mb-2"><a href={service.link}>{service.title}</a></h3>
                        <p className="mb-4">Nullam molestie lacus sit amet velit fermentum feugiat. Mauris auctor eget nunc sit amet.</p>
                        <a href={service.link} className="text-yellow-500">Read More <i className="fal fa-long-arrow-right"></i></a>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Rooms = () => (
    <section className="py-24">
        <div className="container mx-auto text-center">
            <h5 className="text-yellow-500">The pleasure of luxury</h5>
            <h2 className="text-3xl font-bold mb-4">Rooms & Suites</h2>
            <p className="mb-8">Proin consectetur non dolor vitae pulvinar. Pellentesque sollicitudin dolor eget neque viverra, sed interdum metus interdum.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: "Classic Balcony Room", price: "$600/Night", img: "img/gallery/room-img01.png", link: "single-rooms.html" },
                    { title: "Superior Double Room", price: "$400/Night", img: "img/gallery/room-img02.png", link: "single-rooms.html" },
                    { title: "Super Balcony Double Room", price: "$100/Night", img: "img/gallery/room-img03.png", link: "single-rooms.html" },
                    { title: "Delux Double Room", price: "$300/Night", img: "img/gallery/room-img04.png", link: "single-rooms.html" },
                ].map((room, index) => (
                    <div key={index} className="bg-white shadow rounded overflow-hidden">
                        <a href={room.img}><img src={room.img} alt="room" className="w-full h-48 object-cover" /></a>
                        <div className="p-6">
                            <div className="flex justify-between mb-4">
                                <span>{room.price}</span>
                                <a href="contact.html" className="text-yellow-500">Book Now</a>
                            </div>
                            <h4 className="text-xl font-bold mb-2"><a href={room.link}>{room.title}</a></h4>
                            <p className="mb-4">Aenean vehicula ligula eu rhoncus porttitor. Duis vel lacinia quam.</p>
                            <div className="flex space-x-2">
                                {Array(6).fill().map((_, i) => (
                                    <img key={i} src={`img/icon/sve-icon${i+1}.png`} alt="icon" className="h-6" />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Feature = () => (
    <section className="py-24 bg-gray-100">
        <div className="container mx-auto flex flex-wrap items-center">
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                <img src="img/features/feature.png" alt="feature" className="w-full rounded" />
            </div>
            <div className="w-full lg:w-1/2 pl-4">
                <h5 className="text-yellow-500">Luxury Hotel & Resort</h5>
                <h2 className="text-3xl font-bold mb-4">Pearl Of The Adriatic.</h2>
                <p className="mb-4">Vestibulum non ornare nunc. Maecenas a metus in est iaculis pretium.</p>
                <p className="mb-4">Cras finibus laoreet felis et hendrerit. Integer ligula lorem, finibus vitae lorem at.</p>
                <a href="about.html" className="bg-yellow-500 text-white px-6 py-3 rounded">Discover More</a>
            </div>
        </div>
    </section>
);

const Pricing = () => (
    <section className="py-24 relative">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                    <h5 className="text-yellow-500">Best Prices</h5>
                    <h2 className="text-3xl font-bold mb-4">Extra Services</h2>
                    <p className="mb-4">Proin consectetur non dolor vitae pulvinar. Pellentesque sollicitudin dolor eget neque viverra.</p>
                    <p>Cras finibus laoreet felis et hendrerit. Integer ligula lorem, finibus vitae lorem at.</p>
                </div>
                {[
                    { title: "Room cleaning", price: "$39.99", desc: "Perfect for early-stage startups" },
                    { title: "Drinks included", price: "$59.99", desc: "Perfect for early-stage startups" },
                ].map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="mb-2">{item.desc}</p>
                        <div className="text-gray-500">Monthly</div>
                        <h2 className="text-2xl font-bold mb-4">{item.price}</h2>
                        <hr />
                        <ul className="list-disc pl-5 my-4">
                            <li>Hotel quis justo at lorem</li>
                            <li>Fusce sodales, urna et tempus</li>
                            <li>Vestibulum blandit lorem quis</li>
                        </ul>
                        <a href="contact.html" className="bg-yellow-500 text-white px-6 py-3 rounded">Get Started <i className="fal fa-angle-right"></i></a>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Testimonials = () => (
    <section className="py-24" style={{ backgroundImage: "url(img/bg/testimonial-bg.png)", backgroundSize: "cover" }}>
        <div className="container mx-auto text-center">
            <h5 className="text-yellow-500">Testimonial</h5>
            <h2 className="text-3xl font-bold mb-4">What Our Clients Says</h2>
            <p className="mb-8">Proin consectetur non dolor vitae pulvinar. Pellentesque sollicitudin dolor eget neque viverra.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { name: "Jina Nilson", img: "img/testimonial/testi_avatar.png" },
                    { name: "Braitly Dcosta", img: "img/testimonial/testi_avatar_02.png" },
                    { name: "Roboto Dose", img: "img/testimonial/testi_avatar_03.png" },
                ].map((testimonial, index) => (
                    <div key={index} className="bg-white p-6 rounded shadow">
                        <div className="flex items-center mb-4">
                            <img src={testimonial.img} alt="avatar" className="h-12 w-12 rounded-full mr-4" />
                            <div>
                                <h6 className="font-bold">{testimonial.name}</h6>
                                <span>Client</span>
                            </div>
                        </div>
                        <img src="img/testimonial/review-icon.png" alt="review" className="h-8 mb-4" />
                        <p>“Phasellus aliquam quis lorem amet dapibus feugiat vitae purus vitae efficitur.”</p>
                        <img src="img/testimonial/qt-icon.png" alt="quote" className="h-8 mt-4" />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Video = () => (
    <section className="py-24 text-center" style={{ backgroundImage: "url(img/bg/video-bg.png)", backgroundSize: "cover" }}>
        <div className="container mx-auto">
            <a href="https://www.youtube.com/watch?v=gyGsPlt06bo" className="inline-block mb-4">
                <img src="img/bg/play-button.png" alt="play" className="h-16" />
            </a>
            <h2 className="text-3xl font-bold">Take A Tour Of Luxuri</h2>
        </div>
    </section>
);

const Blog = () => (
    <section className="py-24">
        <div className="container mx-auto text-center">
            <h5 className="text-yellow-500">Our Blog</h5>
            <h2 className="text-3xl font-bold mb-4">Latest Blog & News</h2>
            <p className="mb-8">Proin consectetur non dolor vitae pulvinar. Pellentesque sollicitudin dolor eget neque viverra.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: "Cras accumsan nulla nec lacus ultricies placerat.", img: "img/blog/inner_b1.jpg" },
                    { title: "Dras accumsan nulla nec lacus ultricies placerat.", img: "img/blog/inner_b2.jpg" },
                    { title: "Seas accumsan nulla nec lacus ultricies placerat.", img: "img/blog/inner_b3.jpg" },
                ].map((post, index) => (
                    <div key={index} className="bg-white shadow rounded overflow-hidden">
                        <a href="blog-details.html"><img src={post.img} alt="blog" className="w-full h-48 object-cover" /></a>
                        <div className="p-6">
                            <div className="text-gray-500 mb-2">24th March 2022</div>
                            <h4 className="text-xl font-bold mb-2"><a href="blog-details.html">{post.title}</a></h4>
                            <p className="mb-4">Curabitur sagittis libero tincidunt tempor finibus.</p>
                            <a href="blog-details.html" className="text-yellow-500">Read More</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Brand = () => (
    <section className="py-12 bg-gray-100">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array(5).fill().map((_, index) => (
                <img key={index} src={`img/brand/b-logo${index+1}.png`} alt="brand" className="h-12 mx-auto" />
            ))}
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
                <img src="img/logo/logo.png" alt="logo" className="h-12 mb-4" />
                <ul className="space-y-4">
                    <li className="flex items-center">
                        <i className="fal fa-phone mr-2"></i>
                        <span>1800-121-3637<br />+91-7052-101-786</span>
                    </li>
                    <li className="flex items-center">
                        <i className="fal fa-envelope mr-2"></i>
                        <span>
                            <a href="mailto:info@example.com">info@example.com</a><br />
                            <a href="mailto:help@example.com">help@example.com</a>
                        </span>
                    </li>
                    <li className="flex items-center">
                        <i className="fal fa-map-marker-check mr-2"></i>
                        <span>1247/Plot No. 39, 15th Phase, LHB Colony, Kanpur</span>
                    </li>
                </ul>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4">Our Links</h2>
                <ul className="space-y-2">
                    <li><a href="index-2.html" className="text-white">Home</a></li>
                    <li><a href="about.html" className="text-white">About Us</a></li>
                    <li><a href="services.html" className="text-white">Services</a></li>
                    <li><a href="contact.html" className="text-white">Contact Us</a></li>
                    <li><a href="blog.html" className="text-white">Blog</a></li>
                </ul>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4">Our Services</h2>
                <ul className="space-y-2">
                    <li><a href="faq.html" className="text-white">FAQ</a></li>
                    <li><a href="#" className="text-white">Support</a></li>
                    <li><a href="#" className="text-white">Privacy</a></li>
                    <li><a href="#" className="text-white">Term & Conditions</a></li>
                </ul>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4">Subscribe To Our Newsletter</h2>
                <div className="flex">
                    <input type="email" placeholder="Your Email..." className="p-2 w-full rounded-l" required />
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-r"><i className="fas fa-location-arrow"></i></button>
                </div>
            </div>
        </div>
        <div className="border-t mt-6 pt-4">
            <div className="container mx-auto flex flex-wrap justify-between">
                <div>Copyright &copy; Riorelax 2022. All rights reserved.</div>
                <div className="flex space-x-4">
                    <a href="#" className="text-white"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
    </footer>
);

const App = () => (
    <div>
        <Header />
        <Slider />
        <BookingForm />
        <About />
        <Services />
        <Rooms />
        <Feature />
        <Pricing />
        <Testimonials />
        <Video />
        <Blog />
        <Brand />
        <Footer />
    </div>
);

export default App;