let jwt = require('jsonwebtoken');
const crypto = require('crypto');
const queries = require('../sql/queries.js');

let checkToken = (req, res, next, key) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, key, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.jwt = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let checkTokenForAdmin = (req, res, next) => {
  return checkToken(req, res, next, process.env.JWT_SECRET);
}

let checkTokenForAdminOrMaintenance = (req, res, next) => {
  return checkToken(req, res, next, process.env.JWT_SECRET);
}

let checkTokenAllUsers = (req, res, next) => {
  return checkToken(req, res, next, process.env.JWT_SECRET);
}

function genRandomString(length)
{
  return crypto.randomBytes(Math.ceil(length/2))
          .toString('hex') // convert to hexadecimal format 
          .slice(0,length);   // return required number of characters
}

module.exports = {
  checkTokenForAdmin,
  checkTokenForAdminOrMaintenance,
  checkTokenAllUsers,
  genRandomString
}
