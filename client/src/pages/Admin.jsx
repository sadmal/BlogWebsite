import React, {  useEffect, useState } from 'react'
import "./css/admin.css"
import axios from 'axios'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';



const Admin = () => {
    const [adminPosts, setAdminPosts] = useState([]);
    const navigate = useNavigate()
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/adminPosts/approvalPosts`)
                setAdminPosts(res.data)
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData();
    })

    const getText = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

    const approvedPost = async (e) => {
        const id1 = e.target.id
        const index = adminPosts.findIndex(obj => obj.id === Number(id1))

        try {
            await axios.all[axios.post(`http://localhost:5000/api/posts/add`, {
                id: adminPosts[index].id, title: adminPosts[index].title, des: adminPosts[index].des, img: adminPosts[index].img, date: moment(Date.now(), true).format(" HH:mm:ss MM-DD-YYYY"), uid: adminPosts[index].uid, cat: adminPosts[index].cat
            }, navigate("/admin"))
                ,
                axios.post(`http://localhost:5000/api/adminPosts/deletePost`,{
                    id: adminPosts[index].id
                })
            ]
        }
        catch (err) {
            console.log(err)
        }
    }
     
    const rejectedPost = (e) => {
        const id1 = e.target.id
        const index = adminPosts.findIndex(objReject => objReject.id === Number(id1))
        try {
            axios.post(`http://localhost:5000/api/adminPosts/deletePost`, {
                id: adminPosts[index].id
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="adminHome">
            <div className="adminposts">
                {adminPosts.length === 0 ? <h1 style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>No posts</h1> : true}
                {adminPosts.map((adminPost) => (
                    <div className="adminpost" key={adminPost.id}>
                        <div className="adminimg">
                            <img src={`../upload/${adminPost.img}`} alt="img" />
                        </div>
                        <div className="admincontent">
                            <h1 className='adminlink'>{adminPost.title}</h1>
                            <p className='admindesc'>{getText(adminPost.des)}</p>
                            <div className='adminBtns'>
                                <button className='Btn1' id={adminPost.id} onClick={approvedPost}>Approve</button>
                                <button className='Btn1' id={adminPost.id} onClick={rejectedPost}>Reject</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}



export default Admin;
