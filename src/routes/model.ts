var express = require('express');
var router = express.Router();
import { create, update, remove, list, load, inference } from "../controller/modelController";

//create model
router.put('/create', function(req:any, res:any) {
  create(req, res);
});

//update model
router.put('/:id/update', function(req:any, res:any) {
  update(req, res);
});

//delete model
router.delete('/:id/delete', function(req:any, res:any) {
  remove(req, res);
});

//list of models
router.get('/list', function(req:any, res:any) {
  list(req, res);
});

//load model's file
router.post('/id:/load', function(req:any, res:any) {
  load(req, res);
});

//calculating inference of a specific image on a specific model
router.get(':id/inference/image/:id', function(req:any, res:any) {
  inference(req, res);
});

module.exports = router;