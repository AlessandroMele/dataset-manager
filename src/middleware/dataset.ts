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
      if (typeof req.body.datasetName !== 'string') {
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
 export const checkClasses = function (req: any, res: any, next: any) {
  try {
    //checking if model_name is valid
    if (typeof req.body.classes !== 'number') {
      var error = errorFactory.getError(ErrEnum.NoInputClassesError).getMessage();
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

/**
 * Check if the input body contains valid number classes of dataset
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkImage = function (req: any, res: any, next: any) {
  try {
    const array: string[] = req.files.fileName.mimetype.split('/');
    const type: string  = array[0];
    //checking if model_name is valid
    if (type !== 'image') {
      var error = errorFactory.getError(ErrEnum.NoInputImageError).getMessage();
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
 * Check if the input body contains valid number classes of dataset
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkZip = function (req: any, res: any, next: any) {
  try {
    const array: string[] = req.files.fileName.mimetype.split('/');
    const hopeIsZip: string  = array[1];
    if (hopeIsZip !== 'zip') {
      var error = errorFactory.getError(ErrEnum.NoInputZipError).getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};