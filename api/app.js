const express = require("express")
const router = require("./routes/auth")
const postRoutes = require("./routes/posts")
const session = require("express-session")
const commentRoutes = require("./routes/comment")
const likesRoutes = require("./routes/likes")
const adminRoutes = require("./routes/adminPost")
var cors = require('cors');
const cookieParser = require("cookie-parser")
const multer = require("multer")
require('dotenv').config()

var app = express()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })

app.post("/api/upload", upload.single("file"), function (req, res) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const file = req.file ? req.file : ""
  res.status(200).json(file.filename);
})

const PORT = 5000
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", router);
app.use('/api/posts', postRoutes)
app.use('/api/adminPosts', adminRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/likes', likesRoutes)

app.listen(PORT, () => { console.log(`connected on ${PORT}`) })




