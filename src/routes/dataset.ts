import {
  checkRequestContent,
  checkRequestContentForm,
} from "../middleware/util/util";
import {
  create,
  update,
  remove,
  list,
  imageInsert,
  zipInsert,
  labelInsert,
  labelInsertList,
} from "../controller/datasetController";

import {
  checkDatasetName,
  checKeywords,
  checkClasses,
  checkImageFile,
  checkZip,
  checkClassName,
  checkBoundingBoxesName,
  checkImageIdentifier,
  checkClassNameList,
  checkBoundingBoxesNameList,
  checkImageIdentifierList,
  checkLabelList,
} from "../middleware/dataset";
import { checkInputFile } from "../middleware/model";

var express = require("express");
var router = express.Router();

//creating dataset
router.put(
  "/create",
  [
    checkRequestContent,
    express.json(),
    checkDatasetName,
    checKeywords,
    checkClasses,
  ],
  function (req: any, res: any) {
    create(
      req.body.datasetName,
      req.body.classes,
      req.body.keywords,
      req.headers["authorization"],
      res
    );
  }
);

//updating dataset
router.put("/update", function (req: any, res: any) {
  update(req, res);
});

//deleting dataset
router.delete(
  "/delete",
  [checkRequestContent, express.json(), checkDatasetName],
  function (req: any, res: any) {
    remove(req.body.datasetName, req.headers["authorization"], res);
  }
);

//dataset's list
router.get("/list", function (req: any, res: any) {
  list(req.headers["authorization"], res);
});

//insert a single image on the specified dataset
router.put(
  "/image",
  [checkRequestContentForm, checkInputFile, checkImageFile, checkDatasetName],
  function (req: any, res: any) {
    imageInsert(req, req.headers["authorization"], res);
  }
);

//insert a zip images on the specified dataset
router.put(
  "/zip",
  [checkRequestContentForm, checkInputFile, checkZip],
  function (req: any, res: any) {
    zipInsert(req, req.headers["authorization"], res);
  }
);

//insert a label on a specific image
router.post(
  "/label",
  [
    checkRequestContent,
    express.json(),
    checkClassName,
    checkBoundingBoxesName,
    checkImageIdentifier,
  ],
  function (req: any, res: any) {
    // if bounding boxes parameters are set, then call the apposite function
    labelInsert(
      req.body.imagePath,
      req.body.className,
      req.body.height,
      req.body.width,
      req.body.center,
      req.headers["authorization"],
      res
    );
  }
);

//insert list of label
router.post(
  "/insertList",
  [
    checkRequestContent,
    express.json(),
    checkLabelList,
    checkClassNameList,
    checkBoundingBoxesNameList,
    checkImageIdentifierList,
  ],
  function (req: any, res: any) {
    // if bounding boxes parameters are set, then call the apposite function
    labelInsertList(req.body.labelList, req.headers["authorization"], res);
  }
);

module.exports = router;
