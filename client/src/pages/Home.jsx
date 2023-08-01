import React, { useEffect, useState } from 'react'
import "./css/home.css"
import { Link, useLocation } from "react-router-dom"
import axios from 'axios'
import Header from "./Header";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const cat = useLocation().search
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts${cat}`)
        setPosts(res.data)
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchData();
  }, [cat])

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }

  return (
    <div className="home">
      <Header/>
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              <img src={`../upload/${post.img}`} alt="" />
            </div>
            <div className="content">
              <h1 className='link'>{post.title}</h1>
             
              <p className='desc'>{getText(post.des)}</p>
              <Link  to={`/post/${post.id}`}><button className='readbtn'>Read More</button></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
