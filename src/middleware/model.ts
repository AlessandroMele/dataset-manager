import {ErrEnum, Response} from "../responseFactory/util"
import {ErrorFactory} from "../responseFactory/Error"


const errorFactory: ErrorFactory = new ErrorFactory();

/**
 * Check if the input body contains valid model_name
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkModelName = function (req: any, res: any, next: any) {
    try {
        //checking if model_name is valid
        if (typeof req.body.model_name !== 'string') {
            var error = errorFactory.getError(ErrEnum.NoInputModelError).getMessage();
            next(error)
        }
        else next()
    }
    catch (error: any) {
        var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
        next(error)
    };
}


/**
 * Check if the input body contains valid dataset
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkDatasetName = function (req: any, res: any, next: any) {
    try {
        //checking if dataset is valid
        if (typeof req.body.dataset !== 'string') {
            var error = errorFactory.getError(ErrEnum.NoInputDatasetError).getMessage();
            next(error)
        }
        else next()
    }
    catch (error: any) {
        var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
        next(error)
    };
}