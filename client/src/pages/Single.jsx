import React, { useContext, useEffect, useState } from 'react';
import "./css/single.css";
import Menu from "../Components/Menu";
import { AuthContext } from '../context/authContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import moment from 'moment';
import Swal from 'sweetalert2';

const Single = () => {
  const newLocal = useLocation().state;
  const state = newLocal
  const [show, setShow] = useState(true)
  const [comment, setComment] = useState(state?.comment || "")
  const [commentarray, setCommentArray] = useState([])
  const [post, setPost] = useState({})
  const [like, setLike] = useState([])
  const location = useLocation()
  const navigate = useNavigate()

  const { currentUser } = useContext(AuthContext);
  const user = currentUser ? currentUser.username : ""
  const postId = location.pathname.split("/")[2]

  const fetchDataLike = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/likes/${postId}`)
      setLike(res.data)

      if (res) {
        fetchDataLike()
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  const showButton = () => {
    setShow(false)
  }

  const hideButton = () => {
    setShow(true)
  }

  const fetchDataPost = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${postId}`)
      setPost(res.data)
    }
    catch (err) {
      console.log(err)
    }
  }

  const fetchingDataComment = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comment/${postId}`);
      setCommentArray(res.data)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchDataLike()
    fetchDataPost();
    fetchingDataComment()
  }, [postId])

  const addComment = async (e) => {
    e.preventDefault()
    if (user) {
      if (comment !== "") {
        try {
          let getResult = await axios.put(`http://localhost:5000/api/comment/add/${postId}`, {
            comment, postId
          });

          if (getResult) {
            fetchingDataComment();
            setComment("");
          }
        }
        catch (err) {
          console.log(err);
        }
      }
    }
    else {
      Swal.fire("To comment  a post please Register first!!")
    }
  }

  const DeleteComment = async (e) => {
    e.preventDefault()
    try {
      let resultData = await axios.delete(`http://localhost:5000/api/comment/delete/${postId}`, {
        postId
      });
      if (resultData) {
        fetchingDataComment();
        setComment("");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }

  const addLike = async () => {
    try {
      await axios.post(`http://localhost:5000/api/likes/add/${postId}`, {
        postId
      });
    } catch (err) {
      console.log(err);
    }
  }

  const disLike = async () => {
    try {
      await axios.post(`http://localhost:5000/api/likes/dis/${postId}`, {
        postId
      });
    } catch (err) {
      console.log(err);
    }
  }

  const likeBtn = () => {
    if (user) {
      addLike()
      hideButton()
    }
    else {
      Swal.fire("To Like/Dislike a post please Register first!!")
    }
  }

  const dislikeBtn = () => {
    disLike()
    showButton()

  }

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }

  const id = currentUser ? currentUser.id : ""

  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post?.img}`} alt="" />
        <br />
        <>
          <div className='likesIcon'>
            {like.includes(id) ? (<button className='dislikebtn'> <i onClick={dislikeBtn} className="fa fa-thumbs-down" style={{ fontSize: "30px", color: "black" }}></i></button>)
              : (<button className='likebtn' onClick={likeBtn}><i style={{ fontSize: "30px", color: "red" }} className="fa fa-thumbs-up"></i></button>)
            }
          </div>
          {like.length}
        </>
        <br />
        <h4>Comments:</h4>
        <form onSubmit={DeleteComment}>
          {
            commentarray.map((data) => {
              return <h5 className='commentdecor' key={data.ID}>- {data ? data.comment : ""}
                {currentUser === null ? "" : (currentUser.username === post.username ? <button className='deleteComment'>delete</button> : "")}</h5>
            })
          }
        </form>
        <form onSubmit={addComment}>
          <input type="text" className='comment' name='comment' value={comment} placeholder='ENTER YOUR COMMENT' onChange={(e) => setComment(e.target.value)} />
          <button>comment</button>
        </form>

        <div className="user">
          <img src="https://images.pexels.com/photos/7063780/pexels-photo-7063780.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
          <div className="info">
            <span>{(post.username)}</span>
            <p>Posted on {moment.utc(post.date).format('MMMM Do YYYY, h:mm:ss a')}</p>
          </div>
          {currentUser === null ? "" : (currentUser.username === post.username ? <div className='edit'>
            <Link to={`/write?edit=2`} state={post}>
              <img className='pics' src={Edit} alt='img' />
            </Link>
            <img className='pics' onClick={handleDelete} src={Delete} alt="delete" />
          </div> : "")}
        </div>
        <h1>{post.title}</h1>
        <p>{getText(post.des)}</p>
      </div>
      <div className="menu">
        <Menu cat={post.cat} />
      </div>
    </div>
  )
}

export default Single
