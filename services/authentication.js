const JWT = require('jsonwebtoken');

const secret = "v@n$h#156"


function createtokenforuser(user){
  const payload = {
    _id:user._id,
    email:user.email,
    ProfileImageURL:user.ProfileImageURL,
    role:user.role,
  };

  const token = JWT.sign(payload , secret);
  return token;

}

function validationToken(token){
  const payload = JWT.verify(token , secret);
  return payload;
}

module.exports = {
  createtokenforuser,
  validationToken,
};