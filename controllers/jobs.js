const Jobs = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

//filtering every jobs based on the user id scince in app js we placed ourauth infront of every jobs routes so we can get the req.user in the jobs routes and also the auth header with respective register token
const getallJobs = async (req, res) => {
  const job = await Jobs.find({ createdBy: req.user.userId }).sort('createdAt'); //if we add -infront of creatred at we will omit that see this topic in 186 alternative code
  res.status(StatusCodes.OK).json({ job, count: job.length });
};

const getJobs = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobsId }
  } = req; //nested destructuring

  const job = await Jobs.findOne({ _id: jobsId, createdBy: userId });
  if (!job) throw new NotFoundError('job not found');
  res.status(StatusCodes.OK).json({ job });
};

//creating jobs according to the userId as for connecting the user DB
const createJobs = async (req, res) => {
  //1.in req.body the jobs we created from the client will appear
  console.log('jobs body >>>>>>>>>>>>>>>>>>>>>>>', req.body);
  //2.in req.user the logined/registered user details along with the token(&userId) will be passed  to auth route
  console.log('jobs body user >>>>>>>>>>>>>>>>>>>>>>>', req.user);
  //3.now we connect the jobs collection with the user collection based on the userId
  req.body.createdBy = req.user.userId;
  const job = await Jobs.create({ ...req.body });
  //0.res.json(req.body); //jsut a json res,not created in db so to create in db use create method with job modele
  //while creating the new jobs for jobs _id will create and for user seperate _id will create this will cause name confusion between the two collection. so give seperate name for each id as userId
  console.log('jobs created >>>>>>>>>>>>>>>>>>>>>>>', req.user, req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

//if we want to destruncture / extract more variable from the backend in a single route like getsinglejob or update job we can have req and from that req we can have the nested destruction
const updateJobs = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobsId },
    body: { company, position }
  } = req;

  if (company === '' || position === '') throw new BadRequestError('both feilds is required, dont leave either empty');
  const job = await Jobs.findByIdAndUpdate({ _id: jobsId, createdBy: userId }, req.body, { new: true, runValidators: true });
  //here in findbyiddbupdate in first option we use jobsId to find the respected jobs for the userId and in the second option we use the body and in the third option we use the validation for showing and options for showing the new updated value
  if (!job) throw new NotFoundError(`job not found with id ${jobsId}`);
  res.status(StatusCodes.OK).json({ job });
};

const deleteJobs = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId }
  } = req;

  const job = await Jobs.findByIdAndDelete({
    _id: jobId,
    createdBy: userId
  });
  if (!job) {
    throw new NotFoundError('job not found in db');
  }
  res.status(StatusCodes.OK).send(); //there is no need for the res msg as it is deleted successfully
};

const deleteallJobs = async (req, res) => {
  res.send('deleteJobs');
};

module.exports = {
  getallJobs,
  getJobs,
  createJobs,
  updateJobs,
  deleteJobs,
  deleteallJobs
};
