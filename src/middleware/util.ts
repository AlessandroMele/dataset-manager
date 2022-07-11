import {ErrEnum, Response, formatResponse} from "../responseFactory/util";
import {ErrorFactory} from "../responseFactory/Error";

const errorFactory: ErrorFactory = new ErrorFactory();

export const renderErrors = (err: Response, req: any, res: any, next: any): void => {
  try {
    if (err !== null) {
      formatResponse(res, err);
    } else next();
  } catch (err: any) {
    formatResponse(res, errorFactory.getError(ErrEnum.InternalError).getMessage())
  }
};

export const renderJsonError = (err: Response, req: any, res: any, next: any): void => {
  try {
    if (err instanceof SyntaxError) {
      formatResponse(res, errorFactory.getError(ErrEnum.RequestErrorJSON).getMessage())
    } else {
      formatResponse(res, errorFactory.getError(ErrEnum.NoJSONRequest).getMessage())
    }
  } catch (err: any) {
    formatResponse(res, errorFactory.getError(ErrEnum.InternalError).getMessage())
  }
};

export const checkRequestContent = (req: any, res: any, next: any): void => {
  if (req.headers["content-type"] == "application/json") next();
  else {
    var error: Response = errorFactory.getError(ErrEnum.NoJSONRequest).getMessage();
    next(error);
  }
};
