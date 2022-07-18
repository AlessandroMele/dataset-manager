const jwt = require("./util/jwtUtil");
import { ErrEnum, Response } from "../responseFactory/util";
import { ErrorFactory } from "../responseFactory/Error";
const emailvalidator = require("email-validator");

const errorFactory: ErrorFactory = new ErrorFactory();

/**
 * Check if the header contains a valid token
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkAutorization = function (req: any, res: any, next: any) {
  try {
    //check if authorization field is empty
    if (req.headers["authorization"] == null) {
      //unauthorized
      var error: Response = errorFactory
        .getError(ErrEnum.AuthError)
        .getMessage();
      next(error);
    } else {
      //extracting token
      let token = req.headers["authorization"];
      //token variable starts with "Bearer ", so now we cut that word
      token = token.slice(7, token.length);
      //checking token
      if (jwt.verifyToken(token) === true) {
        //go next middleware
        next();
      } else {
        var error: Response = errorFactory
          .getError(ErrEnum.AuthError)
          .getMessage();
        next(error);
      }
    }
  } catch (error: any) {
    var error: Response = errorFactory.getError(ErrEnum.AuthError).getMessage();
    next(error);
  }
};

/**
 * Check if the role in the token is set to admin
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkAdmin = function (req: any, res: any, next: any) {
  try {
    //extracting token
    let token = req.headers["authorization"];
    var payload = jwt.getPayload(token);
    var role: string = payload.payload.role;
    //if role is not set to admin, call the error middleware
    if (role !== "admin") {
      var error: Response = errorFactory
        .getError(ErrEnum.AdminAuthError)
        .getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};

/**
 * Check if the input body contains valid username
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkInputUser = function (req: any, res: any, next: any) {
  try {
    //checking if username is valid
    if (
      typeof req.body.username !== "string" ||
      req.body.username.length > 30
    ) {
      var error = errorFactory
        .getError(ErrEnum.NoInputUsernameError)
        .getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};

/**
 * Check if the input body contains valid password
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkInputPassword = function (req: any, res: any, next: any) {
  try {
    //checking if password is valid
    if (
      typeof req.body.password !== "string" ||
      req.body.password.length > 50
    ) {
      var error = errorFactory
        .getError(ErrEnum.NoInputPasswordError)
        .getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};

/**
 * Check if the input body contains valid role
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkInputRole = function (req: any, res: any, next: any) {
  try {
    //checking if role is valid
    if (req.body.role !== "admin" && req.body.role !== "user") {
      var error = errorFactory.getError(ErrEnum.NoInputRoleError).getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};

/**
 * Check if the input body contains valid token number
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkInputToken = function (req: any, res: any, next: any) {
  try {
    //checking if token number is valid
    if (
      typeof req.body.token !== "number" ||
      req.body.token <= 0 ||
      req.body.token >= 10000
    ) {
      var error = errorFactory
        .getError(ErrEnum.NoInputTokenNumberError)
        .getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};

/**
 * Check if the input body contains valid email
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkInputEmail = function (req: any, res: any, next: any) {
  try {
    //checking if email is valid
    if (
      typeof req.body.email !== "string" ||
      !emailvalidator.validate(req.body.email) ||
      req.body.email.length > 50
    ) {
      var error = errorFactory.getError(ErrEnum.NoInputEmailError).getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};
