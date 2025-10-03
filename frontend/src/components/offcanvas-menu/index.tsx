import { useEffect } from "react";
import $ from "jquery";
import "jquery/dist/jquery.min.js";
import { Link } from "react-router-dom";
const OffCanvasMenu = () => {
  useEffect(() => {
    $(".menu-tigger").on("click", function () {
      $(".offcanvas-menu,.offcanvas-overly").addClass("active");
      return false;
    });

    $(".menu-close,.offcanvas-overly").on("click", function () {
      $(".offcanvas-menu,.offcanvas-overly").removeClass("active");
    });

    return () => {
      $(".menu-tigger").off("click");
      $(".menu-close,.offcanvas-overly").off("click");
    };
  }, []);

  return (
    <div>
      <button className="menu-tigger">
        <i className="fal fa-bars" /> Menu
      </button>

      <div className="offcanvas-menu">
        <span className="menu-close"><i className="fal fa-times" /></span>
        <form role="search" className="searchform" action="#">
          <input type="text" name="s" id="search" placeholder="Search" />
          <button><i className="fal fa-search" /></button>
        </form>
        <ul className="menu">
          <li><Link to="/index-2">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/team">Team</Link></li>
          <li><Link to="/projects">Gallery Study</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <ul className="menu mt-100">
          <li><Link to="tel:+8123456897">+8 12 3456897</Link></li>
          <li><Link to="mailto:info@example.com">info@example.com</Link></li>
        </ul>
      </div>

      <div className="offcanvas-overly" />
    </div>
  );
};

export default OffCanvasMenu;
