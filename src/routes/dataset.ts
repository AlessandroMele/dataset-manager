import { checkRequestContent } from "../middleware/util/util";
import {
  create,
  update,
  remove,
  list,
  imageInsert,
  zipInsert,
  labelInsert,
} from "../controller/datasetController";

import {checkDatasetName, checKeywords, checkNumClasses} from "../middleware/dataset"

var express = require("express");
var router = express.Router();

//creating dataset
router.put("/create", [checkRequestContent, express.json(), checkDatasetName, checKeywords, checkNumClasses], function (req: any, res: any) {
  create(req.body.datasetName,req.body.numClasses, req.body.keywords, req.headers["authorization"], res);
});

//updating dataset
router.put("/:id/update", function (req: any, res: any) {
  update(req, res);
});

//deleting dataset
router.delete("/:id/delete",[checkRequestContent, express.json()], function (req: any, res: any) {
  remove(req.headers.datasetName, req.headers["authorization"], res);
});

//dataset's list
router.get("/list", function (req: any, res: any) {
  list(req.headers["authorization"], res);
});

//insert a single image on the specified dataset
router.put("/:id/image/insert", function (req: any, res: any) {
  imageInsert(req, res);
});

//insert a zip images on the specified dataset
router.put("/:id/zip/insert", function (req: any, res: any) {
  zipInsert(req, res);
});

//insert a label on a specific image on the specified dataset
router.put("/:id/image/:id/label/insert",[checkRequestContent, express.json()], function (req: any, res: any) {
  labelInsert(req, res);
});

module.exports = router;
