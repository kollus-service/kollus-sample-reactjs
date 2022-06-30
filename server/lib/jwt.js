const jwt = require('jsonwebtoken');
const constants = require('./constants');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.SECURITY_KEY;

module.exports = {
  sign: (data) => {
    return jwt.sign(data, secretKey, {
      algorithm: 'HS256',
      expiresIn: constants.EXPIRE_TIME,
    });
  },
};