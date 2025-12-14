import React from 'react'
import './NavBar.css'
import aX_logo from '../../assets/aX-logo.png'
import aX_icon from '../../assets/aX-icon.png'

const NavBar = () => {
  return (
    <div className='navbar'>
      <div className="navbar-left">
        <img src={aX_logo} alt="" className='ax-logo'/>
      </div>
      <div className="navbar-center">
        <div className="ax-icon__wrapper">
          <img src={aX_icon} alt="" className='ax-icon'/>
        </div>
      </div>
      <div className="navbar-right">
        <ul>
            <li>Browse</li>
            <li>About Us</li>
            <li>Contact</li>
        </ul>
      </div>
    </div>
  )
}

export default NavBar
