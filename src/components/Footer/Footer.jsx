import React from "react";
import "./Footer.css";
import { Instagram, Twitter, Youtube } from "lucide-react";
import ax_logo from '../../assets/aX-logo.png'
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer with-overlay" id="footer">
      <div className="footer-inner">
        <div className="footer-brand">
            <a href="#"><img src={ax_logo} className='ax-logo' alt="" /></a>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/search">Browse</Link>
            <Link to="/genres">Genres</Link>
            <Link to="/">Home</Link>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a href="#learn-more">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
          </div>

          <div className="footer-col">
            <h4>Social</h4>
            <div className="footer-social">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Twitter/X"><Twitter size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
            </div>
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} AnimatriX. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
