import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./css/login.css"
import axios from 'axios'

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
 
const change = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const headers = {
        "Content-Type":"application/json",
      };
      
      await axios.post("http://localhost:5000/api/auth/register",inputs,{ headers });
     navigate("/login");
    }
    catch(err){
     console.log(err)
    }
  };

  return (
    <div className='auth'>
      <h1>Register</h1>
      <form >
        <input required type="text" placeholder='username' name='username' onChange={change}/>
        <input required type="email" placeholder='email' name='email'  onChange={change}/>
        <input required type="password" placeholder='password' name='password'  onChange={change}/>
        <button className='loginbtn' onClick={handleSubmit}>Register</button>
        <span>Do you have an account? <Link to="/login">Login</Link></span>
      </form>
    </div>
  )
}

export default Register

