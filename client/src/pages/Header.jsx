import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "./css/header.css"
import axios from 'axios';

const Header = ({ cat }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/`)
        setPosts(res.data)
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchData();
  }, [cat])


  return (
    <div className='header'>
      {posts.map((res) => (
        <div className="postmod1" key={res.id}>
          <img src={`../upload/${res.img}`} alt="" />
          <Link to={`/post/${res.id}`}><button>Read More</button></Link>
        </div>
      ))}
    </div>
  )
}

export default Header