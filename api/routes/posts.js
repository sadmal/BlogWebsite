const express = require("express");
const router = express.Router();
const config = require("../dbconfig")
const sql = require("mssql")
const jwt = require("jsonwebtoken")

router.get("/", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  const q = req.query.cat
    ? `SELECT * FROM posts WHERE cat = '${req.query.cat}'`
    : "SELECT * FROM posts";

  reqt.query(q, (err, data) => {
    if (err) return res.status(403).json(" Error!");
    return res.json(data.recordset);
  });
})


router.get("/:id", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();

  const q = `SELECT p.id, username, title, des, img, cat,date FROM blog u JOIN posts p ON u.id = p.uid WHERE p.id = '${req.params.id}'`;

  reqt.query(q, (err, data) => {
    if (err) return console.log(err)
    return res.status(200).json(data.recordset[0])
  });

});



router.post("/add", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `INSERT INTO posts (id,title , des , img  , date , uid , cat ) VALUES (${req.body.id},'${req.body.title}','${req.body.des}','${req.body.img}','${req.body.date}',${req.body.uid},'${req.body.cat}') `

    reqt.query(q, (err, data) => {
      if (err) return res.status(403).json("error");
      return res.json(data);
    });
  })
})


router.delete("/:id", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const postId = req.params.id;
    const q = `DELETE FROM posts WHERE id = '${postId}' AND uid = '${userInfo.id}'`;

    reqt.query(q, (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted!");
    });
  });
})


router.put("/:id", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const postId = req.params.id
    const z = `SELECT img FROM posts WHERE id = '${postId}' `
    const imgupd = await reqt.query(z);
    const imgrlc = req.body.img == undefined ? imgupd.recordset[0].img : req.body.img

    const q = `UPDATE posts SET title = '${req.body.title}' , des = '${req.body.des}' , img = '${imgrlc}'  , cat = '${req.body.cat}' WHERE id = '${postId}' AND uid = '${userInfo.id}'`

    reqt.query(q, (err, data) => {
      if (err) return res.status(403).json(" Error!");
      return res.json(data);
    });
  })
})


module.exports = router;