const mongoose = require('mongoose');
const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');

//schema and validation
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide required name'],
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'please provide required email'],
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide required email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'please provide required password'],
    minlength: 3
  }
});

//hashing the password using mongoose middleware and chechk in for mongoose for pre and validation and also this keyword in the function
userSchema.pre('save', async function () {
  const salt = await bycript.genSalt(10); //byte code
  this.password = await bycript.hash(this.password, salt); //hash+bytecode
});
userSchema.methods.getname = function () {
  //get the user name
  return this.name;
};
userSchema.methods.createToken = function () {
  return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};
userSchema.methods.comparepassword = async function (CandidatePassword) {
  const isMatch = await bycript.compare(CandidatePassword, this.password);
  return isMatch;
};
module.exports = mongoose.model('User', userSchema);
//mongodb will detuct the User table/ collection as user as the first letter will be small
//new keyword will invoke the obj instance of the mongo db
//please provide required and not as require as it will show internal server error 500
//instead of customvalidators we use the mongo validator the error will be huge to see so for that we will use the custom validators
//in token if we left empty like 3 means it will be then take it as 3 days?once check in google
