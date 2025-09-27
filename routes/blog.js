const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require('../modals/blog');
const Comment = require('../modals/comment');
const router = Router();



router.get('/add-new', (req , res) => {
  return res.render('addblog', {
    user:req.user,
  });
} );




//file photo storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./publicimg/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null , filename);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single('Cover Image'),async (req , res) => {
  const {title , body} = req.body;
 const newblog = await Blog.create({
  body,
  title,
  CreatedBy:req.user._id,
  coverimg:`/uploads/${req.file.filename}`,
 });
  return res.redirect(`/blog/${newblog._id}`);
} );


router.get("/:id" ,async (req , res)=>{
  const blog = await Blog.findById(req.params.id).populate("CreatedBy");
 const comments = await Comment.find({blogId:req.params.id}).populate("CreatedBy");
  return res.render("blog",{
    user:req.user,
   blog,
   comments,
  });
});

////commment route
router.post("/comment/:blogId",async (req , res)=>{
 await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    CreatedBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});


module.exports = router;