import { ErrEnum, Response } from "../responseFactory/util";
import { ErrorFactory } from "../responseFactory/Error";

const util = require("util");

const errorFactory: ErrorFactory = new ErrorFactory();
/**
 * Check if the input body contains valid dataset
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkDatasetName = function (req: any, res: any, next: any) {
  try {
      //checking if dataset is valid
      if (typeof req.body.name !== 'string') {
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

/**
 * Check if the input body contains valid number classes of dataset
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkNumClasses = function (req: any, res: any, next: any) {
  try {
    //checking if model_name is valid
    if (typeof req.body.numClasses !== 'number') {
      var error = errorFactory.getError(ErrEnum.NoInputNumClassesError).getMessage();
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
 * Check if the input body contains valid keywords
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checKeywords = function (req: any, res: any, next: any) {
  try {
    //checking if keywords are in the body request
    if (!util.isArray(req.body.keywords)) {
      var error = errorFactory.getError(ErrEnum.NoInputKeywordsError).getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};

