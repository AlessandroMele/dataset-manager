import {checkAutorization, checkInputPassword, checkEmailMatches, checkAdmin, checkInputUser, checkInputRole, checkInputToken, checkInputEmail} from '../middleware/user';
import {login, signUp, residualToken, updateToken} from "../controller/userController";

var express = require('express');
var router = express.Router();


//generate and return the token with informations given in the body (user)
router.post('/login', [checkInputUser, checkInputRole, checkInputEmail, checkInputPassword], function (req: any, res: any) {
  login(req.body.username, req.body.role, req.body.password, req.body.email, res);
});

//register an user in the database (user)
router.post('/signup', [checkInputUser, checkInputEmail, checkInputPassword], function (req: any, res: any) {
  signUp(req.body.username, req.body.password, req.body.email, res);
});

//return user's residual tokens (user)
router.get('/residualToken', [checkAutorization, checkInputEmail, checkEmailMatches], function (req: any, res: any) {
  residualToken(req.body.email, res);
});

//update user's token (admin)
router.post('/updateToken', [checkAutorization, checkAdmin, checkInputToken, checkInputEmail], function (req: any, res: any) {
  updateToken(req.body.email, req.body.token, res);
});

module.exports = router;