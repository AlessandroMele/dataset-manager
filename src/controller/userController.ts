var jwt = require("../middleware/jwtUtil");
import {SuccessEnum, ErrEnum, Response} from "../responseFactory/util"
import {ErrorFactory} from "../responseFactory/Error"
import {SuccessFactory} from "../responseFactory/Success"
import {UserTable} from "../model/Tables"


const errorFactory:ErrorFactory  = new ErrorFactory();
const successFactory:SuccessFactory  = new SuccessFactory();

/**
 * Generate and return the token with informations given in the body
 * @param username username of the user
 * @param role role of the user
 * @param res response
 */
export const login = function(username: string, role: string, res:any){
    try {          
          //generating token
          let token: string = jwt.setToken(username, role)
          
          let decoded: string = jwt.getPayload(token)

            res.status(successFactory.getSuccess(SuccessEnum.JWTSuccess).getMsg().status);
            res.json(
              {
                token: token,
                info: decoded
              });
      } catch (error:any) {
        res.status()
        res.json(errorFactory.getError(ErrEnum.InternalError).getMsg());
      }
};

/**
 * Return user's residual tokens
 * @param email of the user
 * @param res response
 */
export const residualToken = async function(email: string, res: any){
  try {
  const user:any = await UserTable.findOne({ where: { email: email } });
  res.status(200);
  res.json(user.token);
  } catch(err:any) {
    var error: Response = errorFactory.getError(ErrEnum.InternalError).getMsg();
    res.status(error.status)
    res.json(error)
  }
};

/**
 * Update user token
 * @param email email of the user
 * @param token number of token to update
 * @param res response
 */
export const updateToken = async function(email: string, token: number, res: any){
  try {
    const result = await UserTable.update(
      { token: token },
      { where: { email: email }}
    )
    if(result[0] === 1) {
      console.log(result)
    var success: Response = successFactory.getSuccess(SuccessEnum.UpdateSuccess).getMsg();
    res.status(success.status);
    res.json(success);
    }
    else {
      var error: Response = errorFactory.getError(ErrEnum.InternalError).getMsg();
      res.status(error.status)
      res.json(error)
    }
    } catch(err:any) {
      var error: Response = errorFactory.getError(ErrEnum.InternalError).getMsg();
      res.status(error.status)
      res.json(error)
    }
};

