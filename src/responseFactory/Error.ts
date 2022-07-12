import {ErrEnum, Response} from "./util";

interface ErrorMessage {
  getMessage (): Response;
}

class UserAlreadyExists implements ErrorMessage {
  getMessage (): Response {
    return {
      message: "User already exists",
      status: 409 //conflict 
    };
  }
}

class AuthError implements ErrorMessage {
  getMessage (): Response {
    return {
      message: "Unauthorized",
      status: 401
    };
  }
}

class EmailNotMatchError implements ErrorMessage {
  getMessage (): Response {
    return {
      message: "Users can only get their residual token",
      status: 401
    };
  }
}

class AdminAuthError implements ErrorMessage {
  public getMessage (): Response {
    return {
      message: "Sorry, you are not the admin",
      status: 401
    };
  }
}

class CreateTokenErrorUsername implements ErrorMessage {
  public getMessage (): Response {
    return {
      message: "Need to specify string 'username' ",
      status: 400
    };
  }
}

class InputEmailNotValid implements ErrorMessage {
  public getMessage (): Response {
    return {
      message: "Need to specify string 'email'",
      status: 400
    };
  }
}

class NumberTokenNotValid implements ErrorMessage {
  public getMessage (): Response {
    return {
      message: "Need to specify number of 'token'",
      status: 400
    };
  }
}

class CreateTokenErrorRole implements ErrorMessage {
  public getMessage (): Response {
    return {
      message: "Need to specify string 'role', you can pick 'admin' or 'user'",
      status: 400
    };
  }
}

class InternalError implements ErrorMessage {
  public getMessage (): Response {
    return {
      message: "Ops, something went wrong",
      status: 500
    };
  }
}

class RequestErrorJSON implements ErrorMessage {
  public getMessage (): Response {
    return {
      message: "Ops, your json body has some syntax errors",
      status: 400
    };
  }
}

class NoJSONRequest implements ErrorMessage {
  public getMessage (): Response {
    return {
      message: "Your request body need to be a json object",
      status: 400
    };
  }
}

class InputPasswordNotValid implements ErrorMessage {
  public getMessage (): Response {
    return {
      message: "Need to specify string 'password'",
      status: 400
    };
  }
}

class InputCredentialsNotValid implements ErrorMessage {
  public getMessage (): Response {
    return {
      message: "Email or password not valid",
      status: 400
    };
  }
}

class NoUserFoundError implements ErrorMessage {
  public getMessage (): Response {
    return {
      message: "No user found with this email",
      status: 404
    };
  }
}

export class ErrorFactory {
  constructor () {}
  getError (type: ErrEnum): ErrorMessage {
    let error: ErrorMessage | null = null;
    switch (type) {
      case ErrEnum.AuthError:
        error = new AuthError();
        break;
      case ErrEnum.AdminAuthError:
        error = new AdminAuthError();
        break;
      case ErrEnum.RequestErrorJSON:
        error = new RequestErrorJSON();
        break;
      case ErrEnum.CreateTokenErrorUsername:
        error = new CreateTokenErrorUsername();
        break;
      case ErrEnum.InputEmailNotValid:
        error = new InputEmailNotValid();
        break;
      case ErrEnum.NoJSONRequest:
        error = new NoJSONRequest();
        break;
      case ErrEnum.NumberTokenNotValid:
        error = new NumberTokenNotValid();
        break;
      case ErrEnum.EmailNotMatchError:
        error = new EmailNotMatchError();
        break;
      case ErrEnum.CreateTokenErrorRole:
        error = new CreateTokenErrorRole();
        break;
      case ErrEnum.InputPasswordNotValid:
        error = new InputPasswordNotValid();
        break;
      case ErrEnum.InputCredentialsNotValid:
        error = new InputCredentialsNotValid();
        break;
      case ErrEnum.UserAlreadyExists:
        error = new UserAlreadyExists();
        break;
      case ErrEnum.NoUserFoundError:
        error = new NoUserFoundError();
        break;

      default:
        error = new InternalError();
    }

    return error;
  }
}
