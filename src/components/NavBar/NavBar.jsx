import React from 'react'
import './NavBar.css'

const NavBar = () => {
  return (
    <div className='navbar'>
      <div className="navbar-left">
        <h1>LOGO</h1>
      </div>
      <div className="navbar-right">
        <ul>
            <li>Home</li>
            <li>Shop</li>
            <li>Contact</li>
        </ul>
      </div>
    </div>
  )
}

export default NavBar
