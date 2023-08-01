import React, { useContext } from 'react'
import "./navbar.css"
import { Link } from "react-router-dom"
import Logo from "../img/logo.png"
import { AuthContext } from '../context/authContext'

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className='navbar'>
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="logo" />
          </Link>

        </div>
        <div className="links">
          <Link className='Link' to='/?cat=art'><h6>ART</h6></Link>
          <Link className='Link' to='/?cat=science'><h6>SCIENCE</h6></Link>
          <Link className='Link' to='/?cat=technology'><h6>TECHNOLOGY</h6></Link>
          <Link className='Link' to='/?cat=cinema'><h6>CINEMA</h6></Link>
          <Link className='Link' to='/?cat=design'><h6>DESIGN</h6></Link>
          <Link className='Link' to='/?cat=food'><h6>FOOD</h6></Link>
          <span className='currentuser'>{currentUser?.username}</span>
          {currentUser ? (
            <span onClick={logout} className='logoutlink'>Logout</span>
          ) : (
            <Link className="link" to="/login">
              Login
            </Link>
          )}
          <span className='write'>
            <Link className='Link' to="/write">Write</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Navbar
