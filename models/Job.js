const mongoose = require('mongoose');

const jobSchena = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'please provide company name'],
      maxlength: 50
    },
    position: {
      type: String,
      required: [true, 'please provide position'],
      maxlength: 200
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending'
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User', //tying  up jobs to the user
      required: [true, 'please provide user'] //create a job with user
    }
  },
  { timestamps: true } //the time stamps allows monggose to automatically update the time in the when created and  updated to a specific userId from reg/login
);

module.exports = mongoose.model('Jobs', jobSchena);
// enum optioons were we can set the array with the possible values
