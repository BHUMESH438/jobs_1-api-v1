const User = require('../models/User'); //instead of passing obj user can find the specifics by using findone
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = (req, res, next) => {
  //1.check the header.authorization***headers
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('authentication invalid');
  }
  //2.get the token from the header
  //this will split the token from bearer even if we split it here it wont split unless if the user send the token with space
  const token = authHeader.split(' ')[1];
  //3.use try catch to verify the token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //setting the verified obj in the req. params
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    console.log('>>>>>>>>>>>>>>auth error>>', error);
  }
};

module.exports = auth;
