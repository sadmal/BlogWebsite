const express = require("express");
const router = express.Router();
const config = require("../dbconfig")
const sql = require("mssql")
const jwt = require("jsonwebtoken")


router.get("/:id", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  const q = `SELECT userId FROM likes where lid = '${req.params.id}'`
  reqt.query(q, (err, data) => {
    if (err) return console.log(err)
    return res.status(200).json(data.recordset.map(like => like.userId))
  });
});


router.post("/add/:id", async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    let pool = await sql.connect(config);
    let reqt = pool.request();
    const udt = `INSERT INTO likes (ID,userId,lid) VALUES (${Date.now().toString()},${userInfo.id},${req.params.id})`
    reqt.query(udt, (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json("add")
    });
  });
})


router.post("/dis/:id", async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    let pool = await sql.connect(config);
    let reqt = pool.request();
    const udt1 = `DELETE FROM  likes WHERE userId = '${userInfo.id}' AND lid = '${req.params.id}' `
    reqt.query(udt1, (err, data) => {
      if (err) return console.log(err)

      return res.status(200).json("delete")
    });
  })
});


module.exports = router