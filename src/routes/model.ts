import {checkAutorization} from '../middleware/user';
import {checkModelName, checkDatasetName} from '../middleware/model';
import {renderErrors} from '../middleware/util/util';
import {create, update, remove, list, load, inference} from "../controller/modelController";

var express = require('express');
var router = express.Router();

//create model
router.put('/create', [checkAutorization, checkModelName, checkDatasetName], function (req: any, res: any) {
  create(req.body.model_name, req.body.dataset, req.headers["authorization"], res);
});

//update model
router.put('/update', function (req: any, res: any) {
  update(req, res);
});

//delete model
router.delete('/delete', function (req: any, res: any) {
  remove(req, res);
});

//list of models
router.get('/list', [checkAutorization], function (req: any, res: any) {
  list(req.headers["authorization"], res);
});

//load model's file
router.post('/load', function (req: any, res: any) {
  load(req, res);
});

//calculating inference of a specific image on a specific model
router.get(':id/inference/image/:id', function (req: any, res: any) {
  inference(req, res);
});

module.exports = router;