import { checkAutorization } from './middleware/auth';

const userRouter = require('./routes/user');
const modelRouter = require('./routes/model');
const datasetRouter = require('./routes/dataset');

const express = require('express');
const app = express();

//Body request parsed in JSON
app.use(express.json());

//All routes that start with '/user' are managed by userRouter router
app.use('/user', userRouter);
app.use('/model', [checkAutorization],  modelRouter);
app.use('/dataset',[checkAutorization], datasetRouter);

//check if the env variable APP_PORT is set and activate the application 
if(process.env.APP_PORT) {
  var port:string = process.env.APP_PORT;
  } else {
  throw new Error("APP_PORT environment variable is not set");
}

app.listen(Number(port), () => {
  console.log(`Ready for accepting requests on port ${port}`);
});