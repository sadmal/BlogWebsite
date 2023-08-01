const express = require("express")
const router = express.Router();
const config = require("../dbconfig")
const bcrypt = require("bcryptjs")
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const path = require('path');

router.get("/approvalPosts", async (req, res) => {
    let pool = await sql.connect(config);
    let reqt = pool.request();
    const q = "SELECT * FROM admin";
    reqt.query(q, (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data.recordset)
    });
  })


router.post("/addAdminPost", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const quer = "SELECT TOP 1 * FROM posts ORDER BY id DESC"
    const adminQuery = "SELECT TOP 1 * FROM admin ORDER BY id DESC"
    const userId = await reqt.query(quer)
    const adminId = await reqt.query(adminQuery)
    const iden = userId.recordset[0].id
    if (adminId.recordset == "") {
      var uniqueIden = iden + 1
    }
    else {
      uniqueIden = (adminId.recordset[0].id + 1)
    }
    const q = `INSERT INTO admin (id , title , des , img  , date , uid , cat ) VALUES (${uniqueIden},'${req.body.title}','${req.body.des}','${req.body.img}','${req.body.date}',${userInfo.id},'${req.body.cat}')`

    reqt.query(q, (err, data) => {
      if (err) return res.status(403).json("error");
      return res.json(data);
    });
  })
})


router.post("/deletePost", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `DELETE FROM admin WHERE id = ${req.body.id}`
    reqt.query(q, (err, data) => {
      if (err) console.log(err);
      return res.json(data);
    });
  })
})

module.exports = router