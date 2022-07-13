import { checkAutorization } from "./middleware/user";
import { checkRequestContent } from "./middleware/util/util";
import { renderErrors } from "./middleware/util/util";
const userRouter = require("./routes/user");
const modelRouter = require("./routes/model");
const datasetRouter = require("./routes/dataset");
const fileUpload = require("express-fileupload");

const express = require("express");
const app = express();

//Error if the request body is not a JSON
app.use(checkRequestContent);
//Body request parsed in JSON
app.use(express.json());

app.use("/user", userRouter);
app.use("/model", [checkAutorization], modelRouter);
app.use("/dataset", [checkAutorization], datasetRouter);
//Render errors
app.use(renderErrors);

//check if the env variable APP_PORT is set and activate the application
if (process.env.APP_PORT) {
  var port: string = process.env.APP_PORT;
} else {
  throw new Error("APP_PORT environment variable is not set");
}

app.listen(Number(port), () => {
  console.log(`Ready for accepting requests on port ${port}`);
});
