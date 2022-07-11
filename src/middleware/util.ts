import { ErrEnum, Response } from "../responseFactory/util";
import { ErrorFactory } from "../responseFactory/Error";

const errorFactory: ErrorFactory = new ErrorFactory();

export const renderErrors = (err: any, req: any, res: any, next: any): void => {
  try {
    if (err !== null) {
      res.status(err.status);
      res.json(err);
    } else next();
  } catch (err: any) {
    var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
    res.json(error);
  }
};

export const renderJsonError = (
  err: any,
  req: any,
  res: any,
  next: any
): void => {
  try {
    if (err instanceof SyntaxError) {
      var error: Response = errorFactory
        .getError(ErrEnum.RequestErrorJSON)
        .getMessage();
      res.status(error.status);
      res.json(error);
    } else {
      var error: Response = errorFactory
        .getError(ErrEnum.NoJSONRequest)
        .getMessage();
      res.status(error.status);
      res.json(error);
    }
  } catch (err: any) {
    var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
    res.json(error);
  }
};

export const checkRequestContent = (req: any, res: any, next: any): void => {
  if (req.headers["content-type"] == "application/json") next();
  else {
    var error: Response = errorFactory.getError(ErrEnum.NoJSONRequest).getMessage();
    next(error);
  }
};
