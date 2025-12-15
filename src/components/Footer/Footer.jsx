import React from "react";
import "./Footer.css";
import { Instagram, Twitter, Youtube } from "lucide-react";
import ax_logo from '../../assets/aX-logo.png'

const Footer = () => {
  return (
    <footer className="footer with-overlay">
      <div className="footer-inner">
        <div className="footer-brand">
            <img src={ax_logo} className='ax-logo' alt="" />
        </div>

        <nav className="footer-links" aria-label="Footer">
          <div className="footer-col">
            <h4>Explore</h4>
            <a href="#">Browse</a>
            <a href="#">Top Picks</a>
            <a href="#">New</a>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
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
