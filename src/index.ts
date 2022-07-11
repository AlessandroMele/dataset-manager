import { checkAutorization } from "./middleware/user";
import { renderJsonError, checkRequestContent } from "./middleware/util";

const userRouter = require("./routes/user");
const modelRouter = require("./routes/model");
const datasetRouter = require("./routes/dataset");

const express = require("express");
const app = express();

//Error if the request body is not a json
app.use(checkRequestContent);
//Body request parsed in JSON
app.use(express.json());
//Render error if the request json has syntax errors
app.use(renderJsonError);

app.use("/user", userRouter);
app.use("/model", [checkAutorization], modelRouter);
app.use("/dataset", [checkAutorization], datasetRouter);

//check if the env variable APP_PORT is set and activate the application
if (process.env.APP_PORT) {
  var port: string = process.env.APP_PORT;
} else {
  throw new Error("APP_PORT environment variable is not set");
}

app.listen(Number(port), () => {
  console.log(`Ready for accepting requests on port ${port}`);
});
