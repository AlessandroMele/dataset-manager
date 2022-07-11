import { checkAutorization, checkAdmin, checkInputUser, checkInputRole, checkInputToken, checkInputEmail } from '../middleware/user';
import { renderErrors } from '../middleware/util';
import { login, residualToken, updateToken } from "../controller/userController";

var express = require('express');
var router = express.Router();


//generate and return the token with informations given in the body
router.post('/login', [checkInputUser, checkInputRole, renderErrors], function (req: any, res: any) {
  login(req.body.username, req.body.role, res);
});

//return user's residual tokens
router.get('/residualToken', [checkAutorization, checkInputEmail, renderErrors], function (req:any, res:any){
  residualToken(req.body.email, res);
});

//update user's token
router.post('/updateToken', [checkAutorization, checkAdmin, checkInputToken, checkInputEmail, renderErrors], function (req:any, res:any){
  updateToken(req.body.email, req.body.token, res);
});

module.exports = router;