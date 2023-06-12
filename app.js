require('dotenv').config(); //to access the files from our server and to convert it to string
require('express-async-errors'); // error handler middleware between the controllers - errors - app

//security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();
const jobsRoute = require('./routes/jobs');
const authRoute = require('./routes/auth');

//connect DB
const connectDB = require('./db/connect');
// error handler
const authenticateUser = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json()); //to convert the body/json from the client to readable text
app.use(helmet());
app.use(cors());
app.use(xss());

app.set('trust proxy', 1); //to trouble shoot the reverse-proxy/when we push our code to heroku/ some other platfornm
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    //	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    //	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

//routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/jobs', authenticateUser, jobsRoute);

// extra packages

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async url => {
  try {
    await connectDB(process.env.MONGO_URIMONGO_URL);
    console.log('DB connected successfully......');
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();

//after ceonnect db invoke it in the main module () so that the exported fun will be invoked in another module
//always use await so that the code will do the operatin continuously
//in start fun first connect the server to db after to the port
