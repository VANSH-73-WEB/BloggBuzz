require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const blog = require("./modals/blog");
const { checkForAuthenticationCookie } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 7777;

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use("/publicimg", express.static(path.join(__dirname, "publicimg")));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// routes
app.get("/", async (req, res) => {
  const allblog = await blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allblog,
  });
});
app.get("/home", async (req, res) => { res.redirect("/"); });

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () =>
  console.log(`🚀 Server started at PORT : ${PORT}`)
);
