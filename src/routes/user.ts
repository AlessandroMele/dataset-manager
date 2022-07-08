var express = require('express');
var router = express.Router();
import { checkAutorization } from '../middleware/auth';
import { login, residualToken, updateToken } from "../controller/userController";

//generate and return the token with informations given in the body
router.post('/login', function (req: any, res: any) {
  login(req, res);
});

//return user's residual tokens
router.get('/:id/residualToken',[checkAutorization], function (req:any, res:any){
  residualToken(req, res);
});

//update user's token
router.post('/:id/updateToken',[checkAutorization/**, checkAdmin*/], function (req:any, res:any){
  updateToken(req, res);
});

module.exports = router;