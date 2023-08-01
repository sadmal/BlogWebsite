import React, { useContext, useState ,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./css/login.css"
import axios from 'axios'
import { AuthContext } from '../context/authContext';

axios.defaults.withCredentials = true;
const Login = (req, res) => {
  const [inputs, setInput] = useState({
    email: "",
    password: "",
  });
  
  const [admin,setIsAdmin] = useState(0)

  const changevalue = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const res = await axios.post(`http://localhost:5000/api/auth/admin`,inputs);
        setIsAdmin(res.data)
      } catch (err) {
        console.log(err);
      }
    };
    fetchingData()
  } )
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs)
      const result = admin ? admin[0].isAdmin : ""
      {result === 1 ? navigate("/admin") : navigate("/")}     
    }
    catch (err) {
      console.log(err)
    }

  };
  return (
    <div className='auth'>
      <h1>Login</h1>
      <form >
        <input required type="email" placeholder='email' name='email' onChange={changevalue} />
        <input required type="password" placeholder='password' name='password' onChange={changevalue} />
        <button className='loginbtn' onClick={handleSubmit}>Login</button>
        <span>Don't have an account? <Link to="/register">Register</Link></span>
      </form>
    </div>
  )
}

export default Login
