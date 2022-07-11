import {checkAutorization, checkInputPassword, checkEmailMatches, checkAdmin, checkInputUser, checkInputRole, checkInputToken, checkInputEmail} from '../middleware/user';
import {renderErrors} from '../middleware/util';
import {login, signUp, residualToken, updateToken} from "../controller/userController";

var express = require('express');
var router = express.Router();


//generate and return the token with informations given in the body
router.post('/login', [checkInputUser, checkInputRole, checkInputEmail, checkInputPassword, renderErrors], function (req: any, res: any) {
  login(req.body.username, req.body.role, req.body.password, req.body.email, res);
});

//register an user in the database
router.post('/signup', [checkInputUser, checkInputEmail, checkInputPassword, renderErrors], function (req: any, res: any) {
  signUp(req.body.username, req.body.password, req.body.email, res);
});

//return user's residual tokens
router.get('/residualToken', [checkAutorization, checkInputEmail, checkEmailMatches, renderErrors], function (req: any, res: any) {
  residualToken(req.body.email, res);
});

//update user's token
router.post('/updateToken', [checkAutorization, checkAdmin, checkInputToken, checkInputEmail, renderErrors], function (req: any, res: any) {
  updateToken(req.body.email, req.body.token, res);
});

module.exports = router;