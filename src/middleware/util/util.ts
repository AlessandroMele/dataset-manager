import { ErrEnum, Response, formatResponse } from "../../responseFactory/util";
import { ErrorFactory } from "../../responseFactory/Error";

const errorFactory: ErrorFactory = new ErrorFactory();

/**
 * Render errors from previous middleware
 * @param err error generated by previous middleware
 * @param req request
 * @param res response
 * @param next next middleware
 */
export const renderErrors = (
  err: Response,
  req: any,
  res: any,
  next: any
): void => {
  try {
    // the error is related to json string syntax
    if (err instanceof SyntaxError) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.RequestErrorJSON).getMessage()
      );
    } else {
      formatResponse(res, err);
    }
  } catch (err: any) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

/**
 * Check if content type is set to json
 * @param req request
 * @param res response
 * @param next next middleware
 */
export const checkRequestContent = (req: any, res: any, next: any): void => {
  if (req.headers["content-type"] == "application/json") next();
  else {
    var error: Response = errorFactory
      .getError(ErrEnum.NoJSONRequest)
      .getMessage();
    next(error);
  }
};