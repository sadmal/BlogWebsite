const express = require("express")
const router = express.Router();
const config = require("../dbconfig")
const sql = require("mssql");
const jwt = require("jsonwebtoken")

router.put("/add/:id", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated!");
  jwt.verify(token, "jwtkey", async (err) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `INSERT INTO comments (ID,comment,cid) VALUES (${Date.now().toString()},'${req.body.comment}','${req.params.id}') `

    reqt.query(q, (err, data) => {
      if (err) return console.log(err);     
      return res.json(data);
    });
  })
})


router.delete("/delete/:id", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  const que = `SELECT ID FROM comments WHERE cid = '${req.params.id}'`
  const result = await reqt.query(que)

  const quer = result.recordset[0].ID
  const q = `DELETE FROM comments WHERE ID='${quer}'`;

  reqt.query(q, (err, data) => {
    if (err) return res.status(403).json(err);
    return res.json("comment has been deleted!");
  });
});

router.get("/:id", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  const q = `SELECT * FROM comments c JOIN posts p ON cid = p.id WHERE p.id = '${req.params.id}' ORDER BY c.ID ASC`

  reqt.query(q, (err, data) => {
    if (err) return console.log(err);
    let result = data.recordset
    return res.json(result);
  });
})

module.exports = router;