const { Router } = require("express");
const User = require('../modals/user');
const router = Router();


router.get("/signin",(req , res) =>{
  return res.render("signin");
});

router.get("/signup",(req , res) =>{
  return res.render("signup");
});


router.post("/signin" , async (req , res)=>{
  const{ email , password } = req.body;
  try{
 const token = await User.matchPasswordandGeneratetoken(email , password);

 return res.cookie('token' , token).redirect("/");
  }
  catch(error){
    return res.render('signin',{
      error:'Incorrect email or password',
    });

  }
});



router.post("/signup", async (req , res) => {
const { Fullname , email , password } = req.body;
await User.create({
  Fullname,
  email,
  password,
});
return res.redirect("/");
});


router.get("/logout",  (req , res) =>{
  res.clearCookie("token").redirect("/");
});


module.exports = router;