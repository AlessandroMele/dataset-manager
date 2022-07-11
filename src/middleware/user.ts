const jwt = require("./jwtUtil");
import { ErrEnum, Response } from "../responseFactory/util"
import { ErrorFactory } from "../responseFactory/Error"


const errorFactory: ErrorFactory = new ErrorFactory();


/**
 * Check if the header contains a valid token
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkAutorization = function(req: any, res: any, next: any) {
    try {
        //check if authorization field is empty
        if (req.headers["authorization"] == null) {
            //unauthorized
            var error: Response = errorFactory.getError(ErrEnum.AuthError).getMsg();
            next(error)
        }
        else {
            //extracting token
            let token = req.headers["authorization"];
            //token variable starts with "Bearer ", so now we cut that word
            token = token.slice(7, token.length);
            //checking token
            if (jwt.verifyToken(token) === true) {
                //go next middleware
                next();
            }
            else {
                var error: Response = errorFactory.getError(ErrEnum.AuthError).getMsg();
                next(error)
            }
        }
    }
    catch (error: any) {
        var error: Response = errorFactory.getError(ErrEnum.AuthError).getMsg();
        next(error)
    };
}

/**
 * Check if the role in the token is set to admin
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkAdmin = function(req: any, res: any, next: any) {
    try {
        //extracting token
        let token = req.headers["authorization"];
        //token variable starts with "Bearer ", so now we cut that word
        token = token.slice(7, token.length);
        var payload = jwt.getPayload(token)
        var role: string = payload.payload.role;
        //if role is not set to admin, call the error middleware
        if (role !== "admin") {
            var error: Response = errorFactory.getError(ErrEnum.AdminAuthError).getMsg();
            next(error)
        }
        else next();
    }
    catch (error: any) {
        var error: Response = errorFactory.getError(ErrEnum.InternalError).getMsg();
        next(error)
    };
}


/**
 * Check if the input body contains valid username
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkInputUser = function(req: any, res: any, next: any) {
    try {
        //checking if username is valid
        if (typeof req.body.username !== 'string') {
            var error = errorFactory.getError(ErrEnum.CreateTokenErrorUsername).getMsg();
            next(error)
        }
        else next()
    }
    catch (error: any) {
        var error: Response = errorFactory.getError(ErrEnum.InternalError).getMsg();
        next(error)
    };
}


/**
 * Check if the input body contains valid role
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkInputRole = function(req: any, res: any, next: any) {
    try {
        //checking if role is valid
        if (req.body.role !== 'admin' && req.body.role !== 'user') {
            var error = errorFactory.getError(ErrEnum.CreateTokenErrorRole).getMsg();
            next(error)
        }
        else next()
    }
    catch (error: any) {
        var error: Response = errorFactory.getError(ErrEnum.InternalError).getMsg();
        next(error)
    };
}




/**
 * Check if the input body contains valid token number
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkInputToken = function(req: any, res: any, next: any) {
    try {
        //checking if token number is valid
        if (typeof req.body.token !== 'number') {
            var error = errorFactory.getError(ErrEnum.NumberTokenNotValid).getMsg();
            next(error)
        }
        else next()
    }
    catch (error: any) {
        var error: Response = errorFactory.getError(ErrEnum.InternalError).getMsg();
        next(error)
    };
}

/**
 * Check if the input body contains valid email
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkInputEmail = function(req: any, res: any, next: any) {
    try {
        //checking if email is valid
        if (typeof req.body.email !== 'string') {
            var error = errorFactory.getError(ErrEnum.InputEmailNotValid).getMsg();
            next(error)
        }
        else next()
    }
    catch (error: any) {
        var error: Response = errorFactory.getError(ErrEnum.InternalError).getMsg();
        next(error)
    };
}
