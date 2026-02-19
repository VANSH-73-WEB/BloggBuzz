
const { validationToken } = require("../services/authentication");
const User = require("../modals/user");

function checkForAuthenticationCookie(cookieName){
  return async (req , res , next) =>{

    const tokencookievalue = req.cookies[cookieName];
    if(!tokencookievalue){
      return next();
    }

    try{
      const userPayload = validationToken(tokencookievalue);

      const user = await User.findById(userPayload._id);

      req.user = user;

    } catch(error){
      console.log("Invalid token");
    }

    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
