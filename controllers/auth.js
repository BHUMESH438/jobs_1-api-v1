const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new BadRequestError('fill all the feilds');
  // because the user and password check wont allow to make the feild empty so theres no need of controllers empty feild check
  // user check by email
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('user didnot exist for this email');
  //password check according to existing hash in db
  const ispasswordCorrect = await user.comparepassword(password);
  if (!ispasswordCorrect) throw new UnauthenticatedError('password didnot match for this email and user');
  //if both ok create a token
  const token = user.createToken();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

//after register res - {name,userid} as a token
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  console.log('user>>>>>>>>>>>>', user);
  const token = user.createToken();
  res.status(StatusCodes.CREATED).json({ user: { name: user.getname() }, token });
};

module.exports = {
  login,
  register
};

//for creating the data on db we must use create method unless it wont store the data in the db
//note that if we set the same name as the model schema name then the mongoose will get confuse so use some other diff name as User and not as UserShema/userschema - if use - 500 internal server error will occurs
/*;
.**** this is not needed if we pass the validation in the mongoose
.*****
controller validation   const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('enter all 3 feilds');
  }
 **** .
 *** .
 */

/*
.**** 
.*****
 const { name, email, password } = req.body;
 //instead of dumpoing the entire body we will use our temporyry uer obj and also in the temp all the validation property must be there or we will get the error
 //to get the hashpassord we must run gensalt and salt
 const salt = await bycript.genSalt(10);
 const hashpassord = await bycript.hash(password, salt); //here we should pass the password and random bytes i.e salt
 const tempUser = { name, email, password: hashpassord }; //es6 same property and key value need not to be differntiated and now use this tempuser to the create method
 **** .
 *** .
 */
//1.can genrate password instance in mongoose instance
//2.can make schema instance in monggose
//3.can genrate jwt token instance in mongoose

//here we created token s seperatly for register and login so whenever user creates register seperatly a token is genrated and when user creates a login seperatly a token created
