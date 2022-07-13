var jwt = require("../middleware/util/jwtUtil");
import {SuccessEnum, ErrEnum, Response, formatResponse, formatResponseWithData} from '../responseFactory/util';
import {ErrorFactory} from "../responseFactory/Error";
import {SuccessFactory} from "../responseFactory/Success";
import {UserTable} from "../model/tables/Users";

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
export const login = async function (username: string, role: string, password: string, email: string, res: any) {
  try {
    //trying to search existing user
    let user: UserTable | null = await UserTable.findOne({
      where: {email: email, password: password, role: role},
    });
    if (user != null) {
      //generate token
      let [token, decoded]: [string, string] = jwt.setToken(username, role, password, email);;
      formatResponseWithData(res, successFactory.getSuccess(SuccessEnum.JWTSuccess).getMessage(), {token: token, info: decoded})
    }
    //wrong password or email
    else {
      formatResponse(res, errorFactory.getError(ErrEnum.InputCredentialsNotValid).getMessage())
    }
  } catch (error: any) {
    formatResponse(res, errorFactory.getError(ErrEnum.InternalError).getMessage())
  }
};

/**
 * Insert user in the database
 * @param username username of the user
 * @param password password of the user
 * @param email email of the user
 * @param res response
 */
export const signUp = async function (username: string, password: string, email: string, res: any) {
  try {
    //trying to search existing user
    let user: UserTable | null = await UserTable.findOne({
      where: {email: email},
    });
    if (user == null) {
      //insert new user in the database
      let results: UserTable | null = await UserTable.create({
        email: email,
        username: username,
        password: password,
        role: "user"
      });
      formatResponseWithData(res, successFactory.getSuccess(SuccessEnum.UserCreateSuccess).getMessage(), results)
    }
    //user exists
    else {
      formatResponse(res, errorFactory.getError(ErrEnum.UserAlreadyExists).getMessage())
    }
  } catch (err: any) {
    formatResponse(res, errorFactory.getError(ErrEnum.InternalError).getMessage())
  }
};

/**
 * Return user's residual tokens
 * @param email of the user
 * @param res response
 */
export const residualToken = async function (email: string, res: any) {
  try {
    const user: UserTable | null = await UserTable.findOne({where: {email: email}});
    if (user != null) {
      let token: number = user.getDataValue("token");
      formatResponseWithData(res, successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(), {"token": token})
    }
    else {
      formatResponse(res, errorFactory.getError(ErrEnum.NoUserFoundError).getMessage())
    }
  } catch (err: any) {
    formatResponse(res, errorFactory.getError(ErrEnum.InternalError).getMessage())
  }
};

/**
 * Update user token
 * @param email email of the user
 * @param token number of token to update
 * @param res response
 */
export const updateToken = async function (email: string, token: number, res: any) {
  try {

    const result = await UserTable.update(
      {token: token},
      {where: {email: email}}
    );

    const user: UserTable | null = await UserTable.findOne({where: {email: email}});
    if (user != null) {
      formatResponseWithData(res, successFactory.getSuccess(SuccessEnum.UpdateSuccess).getMessage(), user)
    }
    else {
      formatResponse(res, errorFactory.getError(ErrEnum.NoUserFoundError).getMessage())
    }
  } catch (err: any) {
    formatResponse(res, errorFactory.getError(ErrEnum.InternalError).getMessage())
  }
};
