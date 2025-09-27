const {Schema , model} = require("mongoose");

const blogSchema = new Schema({

  title:{
    type:String,
    required: true,
  },
  body:{
   type:String,
    required: true,
  },
 coverimg:{
    type:String,
    required: false,
  },
  CreatedBy:{
    type:Schema.Types.ObjectId,
    ref:"user",
     required: true,
  },
},
{timestamps:true}
);

const blog = model('blog' , blogSchema);

module.exports = blog;