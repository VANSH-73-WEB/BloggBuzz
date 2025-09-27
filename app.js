require("dotenv").config();


const express = require("express");
const path = require ("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const blog = require("./modals/blog");

const mongoose = require("mongoose");


const PORT = process.env.PORT || 8000;


const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middleware/auth");

//middleware
const app = express();
app.use


//
mongoose.connect(process.env.MONGO_URL).then((e) => console.log("MongoDB connected"));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middleware
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./publicimg')));
app.use("/publicimg", express.static(path.resolve("./publicimg")));

//routes
app.get("/",async (req , res) =>{
  const allblog = await blog.find({});
  res.render("home", {
    user: req.user,
    blogs:allblog,
  });
});

app.use("/user" , userRoute);
app.use("/blog", blogRoute);
app.listen(PORT,() => console.log(`server started at PORT :${PORT} `));


//1.modals
//2.routes