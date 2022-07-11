var jwt = require("../middleware/jwtUtil");
import { SuccessEnum, ErrEnum, Response } from "../responseFactory/util";
import { ErrorFactory } from "../responseFactory/Error";
import { SuccessFactory } from "../responseFactory/Success";
import { UserTable } from "../model/Tables";

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();

/**
 * Generate and return the token with informations given in the body
 * @param username username of the user
 * @param role role of the user
 * @param password password of the user
 * @param email email of the user
 * @param res response
 */
export const login = async function (
  username: string,
  role: string,
  password: string,
  email: string,
  res: any
) {
  try {
    //trying tp search existing user
    let results: UserTable | null = await UserTable.findOne({
      where: { email: email, password: password },
    });
    console.log(results);
    if (results != null) {
      //generating token
      let token: string = jwt.setToken(username, role, password, email);

      let decoded: string = jwt.getPayload(token);

      res.status(
        successFactory.getSuccess(SuccessEnum.JWTSuccess).getMessage().status
      );
      res.json({
        token: token,
        info: decoded,
      });
    }
    //wrong password or email
    else {
      var error: Response = errorFactory
        .getError(ErrEnum.InputCredentialsNotValid)
        .getMessage();
      res.status(error.status);
      res.json(error);
    }
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    res.status(error.status);
    res.json(error);
  }
};

/**
 * Generate and return the token with informations given in the body
 * @param username username of the user
 * @param password password of the user
 * @param email email of the user
 * @param res response
 */
export const signUp = async function (
  username: string,
  password: string,
  email: string,
  res: any
) {
  try {
    //trying tp search existing user
    let user: UserTable | null = await UserTable.findOne({
      where: { email: email },
    });
    //if exists, then searching password
    if (user == null) {
      //insert new user in the database
      let results: UserTable | null = await UserTable.create({
        email: email,
        username: username,
        password: password,
        role: "user",
      });

      if (results != null) {
        var success: Response = successFactory
          .getSuccess(SuccessEnum.UserCreateSuccess)
          .getMessage();
        res.status(success.status);
        res.json(success);
      } else {
        var error: Response = errorFactory
          .getError(ErrEnum.InternalError)
          .getMessage();
        res.status(error.status);
        res.json(error);
      }
    }
    //user exists
    else {
      var error: Response = errorFactory
        .getError(ErrEnum.UserAlreadyExists)
        .getMessage();
      res.status(error.status);
      res.json(error);
    }
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    res.status(error.status);
    res.json(error);
  }
};

/**
 * Return user's residual tokens
 * @param email of the user
 * @param res response
 */
export const residualToken = async function (email: string, res: any) {
  try {
    const user: any = await UserTable.findOne({ where: { email: email } });
    res.status(200);
    res.json(user.token);
  } catch (err: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    res.status(error.status);
    res.json(error);
  }
};

/**
 * Update user token
 * @param email email of the user
 * @param token number of token to update
 * @param res response
 */
export const updateToken = async function (
  email: string,
  token: number,
  res: any
) {
  try {
    const result = await UserTable.update(
      { token: token },
      { where: { email: email } }
    );
    if (result[0] === 1) {
      console.log(result);
      var success: Response = successFactory
        .getSuccess(SuccessEnum.UpdateSuccess)
        .getMessage();
      res.status(success.status);
      res.json(success);
    } else {
      var error: Response = errorFactory
        .getError(ErrEnum.InternalError)
        .getMessage();
      res.status(error.status);
      res.json(error);
    }
  } catch (err: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    res.status(error.status);
    res.json(error);
  }
};
