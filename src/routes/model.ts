import {
  checkMetadata,
  checkModelName,
  checkInputFile,
} from "../middleware/model";
import {
  checkDatasetName,
  checkImageFile,
  checkImageName,
} from "../middleware/dataset";
import {
  create,
  updateMetadata,
  updateModelName,
  updateDatasetName,
  updateFile,
  remove,
  list,
  loadFile,
  inference,
} from "../controller/modelController";
import {
  checkRequestContent,
  checkRequestContentForm,
} from "../middleware/util/util";

var express = require("express");
var router = express.Router();

//create model
router.post(
  "",
  [checkRequestContent, express.json(), checkModelName, checkDatasetName],
  function (req: any, res: any) {
    create(
      req.body.modelName,
      req.body.datasetName,
      req.headers["authorization"],
      res
    );
  }
);

//load model file
router.post(
  "/file",
  [checkRequestContentForm, checkInputFile, checkModelName],
  function (req: any, res: any) {
    loadFile(req.files, req.body.modelName, req.headers["authorization"], res);
  }
);

//delete model
router.delete(
  "",
  [checkRequestContent, express.json(), checkModelName],
  function (req: any, res: any) {
    remove(req.body.modelName, req.headers["authorization"], res);
  }
);

//list of models
router.get("/list", [], function (req: any, res: any) {
  list(req.headers["authorization"], res);
});

//update model metadata
router.put(
  "/metadata",
  [checkRequestContent, express.json(), checkModelName, checkMetadata],
  function (req: any, res: any) {
    if (req.body.newModelName && req.body.datasetName)
      updateMetadata(
        req.body.modelName,
        req.body.newModelName,
        req.body.datasetName,
        req.headers["authorization"],
        res
      );
    else if (req.body.newModelName)
      updateModelName(
        req.body.modelName,
        req.body.newModelName,
        req.headers["authorization"],
        res
      );
    else
      updateDatasetName(
        req.body.modelName,
        req.body.datasetName,
        req.headers["authorization"],
        res
      );
  }
);

//update model file
router.put(
  "/file",
  [checkRequestContentForm, checkInputFile, checkModelName],
  function (req: any, res: any) {
    updateFile(
      req.files,
      req.body.modelName,
      req.headers["authorization"],
      res
    );
  }
);

//calculating inference of a specific model on a specific image
router.post(
  "/inference",
  [checkRequestContentForm, checkImageName, checkImageFile, checkModelName],
  function (req: any, res: any) {
    inference(req.files, req.body.modelName, req.headers["authorization"], res);
  }
);

module.exports = router;
