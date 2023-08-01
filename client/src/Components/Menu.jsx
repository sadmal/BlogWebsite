import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "./menu.css"
import axios from 'axios';

const Menu = ({ cat }) => {


  const [posts, setPosts] = useState([]);


  useEffect(() => {
    const fetchData = async () => {

      try {
        const res = await axios.get(`http://localhost:5000/api/posts/?cat=${cat}`)
        setPosts(res.data)
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchData();
  }, [cat])






  return (
    <div className='menu'>
      <h1 className="menuh1">Other posts you may like</h1>
      {posts.map((res) => (

        <div className="postmod" key={res.id}>
          <img src={`../upload/${res.img}`} alt="" />
          <h2>{res.title}</h2>
          <Link to={"/"}><button>Read More</button></Link>

        </div>
      ))}
    </div>
  )
}

export default Menu
