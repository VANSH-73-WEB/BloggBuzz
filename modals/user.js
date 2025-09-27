const { Schema , model } = require("mongoose");
const { randomBytes, createHmac } = require("crypto");
const { createtokenforuser } = require("../services/authentication");


const userSchema = new Schema({
  Fullname:{
    type:String,
    required:true,
    unique: true,
  },
  ProfileImageURL:{
    type:String,
  
    default:"/publicimg/avatar.jpg",
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  salt:{
    type:String,
    // required:true,
  },
  password:{
    type:String,
    required:true,
  },
  role:{
    type:String,
    enum:["USER" , "ADMIN"],
    default:"USER",
  },
},
{timestamps:true});

//before svae the user check the password is modified
userSchema.pre("save" , function (next){
  const user = this;
  if(!user.isModified("password")) return;

  const salt = "someRandmSalt";
  const hashedPassword = createHmac("sha256" , salt)
  .update(user.password)
  .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();

});

userSchema.static('matchPasswordandGeneratetoken',async function(email , password){
  const user =await this.findOne({email});
  if(!user) throw new Error('User not found!');

  const salt = user.salt;
  const hashedPassword = user.password;

  
  const userProvidedhash = createHmac("sha256" , salt)
  .update(password)
  .digest("hex");
  if(hashedPassword!==userProvidedhash) throw new Error('Incorrect password');
  const token = createtokenforuser(user);
  return token;

} );


const User = model('user' , userSchema);

module.exports = User;