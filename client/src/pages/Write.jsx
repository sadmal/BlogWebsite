import React, { useContext, useState } from 'react'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./css/write.css"
import axios from 'axios';
import { AuthContext } from '../context/authContext'
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';

const Write = () => {
  const state = useLocation().state;
  const [file, setFile] = useState(null);
  const [value, setValue] = useState(state?.des || "");
  const [title, setTitle] = useState(state?.title || "");
  const [cat, setCat] = useState(state?.cat || "");
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext);
  
  const user = currentUser ? currentUser.username : ""
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file)
      const res = await axios.post("http://localhost:5000/api/upload", formData)
      return res.data
    }
    catch (err) {
      console.log(err)
    }
  }


  const handleClick = async () => { 
    const imgUrl = await upload()
    if (user) {
      try {
        state ? await axios.put(`http://localhost:5000/api/posts/${state.id}`, {
          title, des: value, cat, img: file ? imgUrl : imgUrl
        },navigate("/"))
          :  await axios.post(`http://localhost:5000/api/adminPosts/addAdminPost`, {
            title, des: value, cat, img: file ? imgUrl : imgUrl, date: moment(Date.now(), true).format(" HH:mm:ss MM-DD-YYYY")
      },navigate("/"))
      }
      catch (err) {
        console.log(err)
      }
    }
    else {
      Swal.fire("To upload post please Register first!!")
    }
  }

  return (
    <div className='add'>
      <div className='content1'>
        <input type="text" value={title} placeholder='Enter your Title' onChange={(e) => setTitle(e.target.value)} />
        <div className="editorcontainer">
          <ReactQuill className='editor' theme="snow" value={value}
            onChange={setValue} />
        </div>
      </div>
      <div className="menu1">
        <div className="item">
          <h1>Publish</h1>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          {file?<img src={URL.createObjectURL(file)} alt='img'/>: <p>preview : No Image</p> }
          <br />
          <br />
          <div className="buttons">
            <button className='writebtn' onClick={handleClick} >Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <input type="radio" checked={cat === "art"} name='cat' value="art" id='art' onChange={e => setCat(e.target.value)} />
          <label htmlFor="art">Art</label>
          <input type="radio" checked={cat === "science"} name='cat' value="science" id='science' onChange={e => setCat(e.target.value)} />
          <label htmlFor="science">Science</label>
          <input type="radio" checked={cat === "technology"} name='cat' value="technology" id='technology' onChange={e => setCat(e.target.value)} />
          <label htmlFor="technology">Technology</label>
          <input type="radio" checked={cat === "cinema"} name='cat' value="cinema" id='cinema' onChange={e => setCat(e.target.value)} />
          <label htmlFor="cinema">Cinema</label>
          <input type="radio" checked={cat === "design"} name='cat' value="design" id='design' onChange={e => setCat(e.target.value)} />
          <label htmlFor="design">Design</label>
          <input type="radio" checked={cat === "food"} name='cat' value="food" id='food' onChange={e => setCat(e.target.value)} />
          <label htmlFor="food">Food</label>
        </div>
      </div>
    </div>
  )
}

export default Write
