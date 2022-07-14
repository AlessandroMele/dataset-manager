import {ErrEnum, Response} from "../responseFactory/util"
import {ErrorFactory} from "../responseFactory/Error"


const errorFactory: ErrorFactory = new ErrorFactory();

/**
 * Check if the input body contains valid modelName
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkModelName = function (req: any, res: any, next: any) {
    try {
        //checking if model_name is valid
        if (typeof req.body.modelName !== 'string') {
            var error = errorFactory.getError(ErrEnum.NoInputModelError).getMessage();
            next(error);
        }
        else next();
    }
    catch (err: any) {
        var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
        next(error);
    };
}

/**
 * Check if the input body contains valid metadata
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkMetadata = function (req: any, res: any, next: any) {
    try {
        //checking if metadata are valid
        if (typeof req.body.newModelName !== 'string' && typeof req.body.datasetName !== 'string') {
            var error = errorFactory.getError(ErrEnum.NoInputMetadataError).getMessage();
            next(error);
        }
        else next();
    }
    catch (err: any) {
        var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
        next(error);
    };
}


/**
 * Check if request contains file
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkInputFile = function (req: any, res: any, next: any) {
    try {
        //checking if metadata are valid
        if (!req.files) {
            var error = errorFactory.getError(ErrEnum.NoInputFileModelError).getMessage();
            next(error);
        }
        else next();
    }
    catch (err: any) {
        var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
        next(error);
    };
}
