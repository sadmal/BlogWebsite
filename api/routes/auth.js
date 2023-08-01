const express = require("express")
const router = express.Router();
const config = require("../dbconfig")
const bcrypt = require("bcryptjs")
const sql = require("mssql");
const notifier = require('node-notifier');
const jwt = require("jsonwebtoken");
const path = require('path');

router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  let pool = await sql.connect(config);
  let reqt = pool.request();
  
  reqt
    .input("id", sql.VarChar(255), Date.now().toString())
    .input("username", sql.VarChar(255), req.body.username)
    .input("email", sql.VarChar(255), req.body.email)
    .input("password", sql.VarChar(255), hashedPassword);

  let quy = `SELECT email FROM blog WHERE email = '${req.body.email}' `
  const result0 = await reqt.query(quy);
  if (req.body.username.length == 0 || req.body.email.length == 0 || req.body.password.length == 0) {
    notifier.notify({
      title: 'ERROR',
      message: 'please fill all your details!!!',
      icon: path.join(__dirname, 'logo.png'),
      sound: true,
      wait: true
    });
  }
  else if (result0.recordset == "") {
    const q = "insert into blog(id,username,email,password,isAdmin) values(@id,@username,@email,@password,0)"
    await reqt.query(q);
    return res.status(200).json("User has been created.");
  }
  else {
    notifier.notify({
      title: 'ERROR',
      message: 'User Already Exist! Go to LogIn',
      sound: true,
      wait: true
    });
  }
});

router.post("/admin", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  
  reqt
  .input("email", sql.VarChar(255), req.body.email)  
  const q = `SELECT isAdmin FROM blog WHERE email = '${req.body.email}' `
  
  reqt.query(q, (err, data) => {
    if (err) return console.log(err);
    let result = data.recordset
    return res.json(result);
  });
})

router.post("/login", async (req, res) => {  
  let pool = await sql.connect(config);
  let reqt = pool.request();
  reqt
    .input("email", sql.VarChar(255), req.body.email)
    .input("password", sql.VarChar(255), req.body.password);

  let quy = `SELECT email FROM blog WHERE email = '${req.body.email}'`;
  const result0 = await reqt.query(quy);
  if (req.body.email.length == 0 || req.body.password.length == 0) {
    notifier.notify({
      title: 'ERROR',
      message: 'please Enter Your Email & Password !!!',
      icon: path.join(__dirname, 'logo.png'),
      sound: true,
      wait: true
    });
  }

  else if (result0.recordset == "") {
    notifier.notify({
      title: 'ERROR',
      message: 'Email not found please Register first!!',
      icon: path.join(__dirname, 'logo.png'),
      sound: true,
      wait: true
    });
  }

  else if (result0.recordset != "") {
    let pass = `SELECT password FROM blog WHERE email = '${req.body.email}'`;
    const result01 = await reqt.query(pass);
    bcrypt.compare(req.body.password, result01.recordset[0].password, async (err, result) => {

      if (result) {
        let uniqueId = `SELECT username,id FROM blog WHERE email = '${req.body.email}'`;
        const result2 = await reqt.query(uniqueId);
        let username = result2.recordset[0].username

        const token = jwt.sign({ id: result2.recordset[0].id }, "jwtkey");
        return res.cookie("access_token", token, {
          httpOnly: true,
        }).status(200).json({
          id: result2.recordset[0].id,
          username,
          email: req.body.email
        })
      }
      else {
        notifier.notify({
          title: 'ERROR',
          message: 'WRONG PASSWORD!!',
          icon: path.join(__dirname, 'logo.png'),
          sound: true,
          wait: true
        });
      }
    })
  }
});

router.post("/logout", async (req, res) => {
  let pool = await sql.connect(config);
  let reqt = pool.request();
  
  const q = "DELETE FROM blog WHERE username = 'Anonymous User'"
  reqt.query(q, (err, data) => {
    if (err) console.log(err)
  });

  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true
  }).status(200).json("User has been logged out.")
});

module.exports = router