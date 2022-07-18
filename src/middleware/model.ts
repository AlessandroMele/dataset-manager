import { ErrEnum, Response } from "../responseFactory/util";
import { ErrorFactory } from "../responseFactory/Error";

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
    if (
      !req.body ||
      typeof req.body.modelName !== "string" ||
      req.body.modelName.length > 30
    ) {
      var error = errorFactory.getError(ErrEnum.NoInputModelError).getMessage();
      next(error);
    } else next();
  } catch (err: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};

/**
 * Check if the input body contains valid metadata
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkMetadata = function (req: any, res: any, next: any) {
  try {
    //checking if metadata are valid
    if (
      typeof req.body.newModelName !== "string" &&
      typeof req.body.datasetName !== "string"
    ) {
      var error = errorFactory
        .getError(ErrEnum.NoInputMetadataError)
        .getMessage();
      next(error);
    } else next();
  } catch (err: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};

/**
 * Check if request contains file
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkInputFile = function (req: any, res: any, next: any) {
  try {
    //checking if exists fileName and if name has less than 40 chars
    if (
      !req.files ||
      !req.files.fileName ||
      req.files.fileName.name.length > 40 ||
      req.files.fileName.name.split(".").pop() !== "py"
    ) {
      var error = errorFactory
        .getError(ErrEnum.NoInputFileModelError)
        .getMessage();
      next(error);
    } else next();
  } catch (err: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};
