import React, { useContext } from 'react'
import "./navbar.css"
import {Link} from "react-router-dom"
import { AuthContext } from '../context/authContext'

const AdminNavbar = () => {
const {currentUser,logout} = useContext(AuthContext);


  return (
    <div className='navbar'>
      <div className="container">       
       
        <div className="links">        
          <span className='currentuser'>{currentUser?.username}</span>
          {currentUser ? (
            <span onClick={logout} className='logoutlink'>Logout</span>
          ) : (
            <Link className="link" to="/login">
              Login
            </Link>
          )}                                      
        </div>
      </div>
    </div>
  )
}

export default AdminNavbar