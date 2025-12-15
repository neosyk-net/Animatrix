import React, { useEffect, useRef, useState } from "react";
import "./NavBar.css";
import aX_logo from "../../assets/aX-logo.png";
import aX_icon from "../../assets/aX-icon.png";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

const toggleMenu = () => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (!isMobile) {
    window.location.reload(); 
    return;
  }

  setMenuOpen((prev) => !prev); 
};


  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedMenu = menuRef.current?.contains(e.target);
      const clickedTrigger = triggerRef.current?.contains(e.target);

      if (!clickedMenu && !clickedTrigger) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <Link to='/'> 
            <img src={aX_logo} alt="AnimatriX logo" className="ax-logo" />
          </Link>
        </div>

        <div className="navbar-center">
          <div className="ax-icon__wrapper" ref={triggerRef} onClick={toggleMenu}>
            <img src={aX_icon} alt="Menu" className="ax-icon" />
          </div>
        </div>

        <div className="navbar-right">
          <ul>
            <Link to='/genres'><li>Browse</li></Link>
            <li><a href="#learn-more">About Us</a></li>
            <li><a href="#footer">Contact</a></li>
          </ul>
        </div>
      </div>

      <div ref={menuRef} className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => setMenuOpen(false)}><Link to='/genres'>Browse</Link></li>
          <li onClick={() => setMenuOpen(false)}><a href="#learn-more">About Us</a></li>
          <li onClick={() => setMenuOpen(false)}><a href="#footer">Contact</a></li>
        </ul>
      </div>
    </>
  );
};

export default NavBar;
