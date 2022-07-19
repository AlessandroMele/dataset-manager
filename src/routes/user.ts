import {
  checkAutorization,
  checkInputPassword,
  checkAdmin,
  checkInputUser,
  checkInputRole,
  checkInputToken,
  checkInputEmail,
} from "../middleware/user";
import {
  login,
  signUp,
  residualToken,
  updateToken,
} from "../controller/userController";
import { checkRequestContent } from "../middleware/util/util";

var express = require("express");
var router = express.Router();
//Error if the request body is not a JSON
router.use(checkRequestContent);
//Body request parsed in JSON
router.use(express.json());

//generate and return the token with informations given in the body (user)
router.post(
  "/login",
  [checkInputUser, checkInputRole, checkInputEmail, checkInputPassword],
  function (req: any, res: any) {
    login(
      req.body.username,
      req.body.role,
      req.body.password,
      req.body.email,
      res
    );
  }
);

//register an user in the database (user)
router.post(
  "/signup",
  [checkInputUser, checkInputEmail, checkInputPassword],
  function (req: any, res: any) {
    signUp(req.body.username, req.body.password, req.body.email, res);
  }
);

//return user's residual tokens (user)
router.get(
  "/residualToken",
  [checkAutorization],
  function (req: any, res: any) {
    residualToken(req.headers["authorization"], res);
  }
);

//update user's token (admin)
router.put(
  "/updateToken",
  [checkAutorization, checkAdmin, checkInputToken, checkInputUser],
  function (req: any, res: any) {
    updateToken(req.body.username, req.body.token, res);
  }
);

module.exports = router;
