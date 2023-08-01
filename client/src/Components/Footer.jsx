import React from 'react'
import Logo from "../img/logo.png"
import "./footer.css"

const Footer = () => {
  return (
    <footer>
      <img className='footerimg' src={Logo} alt="logo" />
    </footer>
  )
}

// useEffect(()=>{
//   const fetchingData = async () =>{
//     try {
//   const res = await axios.get(`http://localhost:5000/api/comment/`);
//   setCommentArray(res.data)
  
// } catch (err) {
//   console.log(err);
// }
//   }
//   fetchingData()
// })

// const addComment = async () =>{
// try {
//    await axios.post(`http://localhost:5000/api/comment/`);
 
  
// } catch (err) {
//   console.log(err);
// }
// }


export default Footer
