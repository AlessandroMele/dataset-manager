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

import {checkDatasetName, checKeywords, checkClasses, checkImage, checkZip} from "../middleware/dataset"

var express = require("express");
var router = express.Router();

//creating dataset
router.put("/create", [checkRequestContent, express.json(), checkDatasetName, checKeywords, checkClasses], function (req: any, res: any) {
  create(req.body.datasetName,req.body.classes, req.body.keywords, req.headers["authorization"], res);
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
router.put("/image", [checkImage],function (req: any, res: any) {
  imageInsert(req, req.headers["authorization"], res);
});

//insert a zip images on the specified dataset
router.put("/zip", [checkZip],function (req: any, res: any) {
  zipInsert(req, req.headers["authorization"], res);
});

//insert a label on a specific image on the specified dataset
router.put("/label",[checkRequestContent, express.json()], function (req: any, res: any) {
  labelInsert(req, req.headers["authorization"], res);
});

module.exports = router;
