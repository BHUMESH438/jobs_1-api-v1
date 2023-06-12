// const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  //for duplicate value in register - setting the custom error
  //1.if error consist of status code from some other middleware then ok or--->
  const customError = {
    //custom error --setup
    statusCode: err.statusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || `something went wrong try again later`
  };
  if (err.name === 'ValidationError') {
    //--validationerror
    customError.msg = Object.values(err.errors)
      .map(item => item.message)
      .join(',');
    customError.statusCode = 400;
  }
  if (err.name === 'CastError') {
    customError.msg = `No items found with the jobs id:${err.value}`;
    customError.statusCode = 404;
  }
  if (err.code && err.code === 11000) {
    //--duplicate value error
    //2.if the error is the instance of custom--- the first and the second code are the same
    //as we set the custome error in the controllers itself and in the 1.custom error we are checking for the status code which is comming from  the other controller function
    // if (err instanceof CustomAPIError) {
    //   return res.status(err.statusCode).json({ msg: err.message });
    // }
    //if the erro has the code property and if it has the value ===11000 and also we can replace it by nullish colacting operator
    customError.msg = `Duplicate valuen entered ${Object.keys(err.keyValue)} please choose another value`;
    customError.statusCode = 400;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;

//if [obj obj] error occurs then in our key value Pairs is an [] so to extract the key we should use the object.keys() in js
