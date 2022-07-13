import { ErrEnum, Response } from "./util";

interface ErrorMessage {
  getMessage(): Response;
}

class UserAlreadyExists implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "User already exists",
      status: 400,
    };
  }
}
class NoInputKeywordsError implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "You have to specify keywords",
      status: 400,
    };
  }
}
class NoInputNumClassesError implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "You have to specify number of classes",
      status: 409, //conflict
    };
  }
}

class ModelAlreadyExists implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "You can't have two models with the same name",
      status: 409, //conflict
    };
  }
}

class AuthError implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "Unauthorized",
      status: 401,
    };
  }
}

class UserNotMatchError implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "Users can only get their residual token",
      status: 401,
    };
  }
}

class AdminAuthError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Sorry, you are not the admin",
      status: 401,
    };
  }
}

class NoInputUsernameError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify string 'username' ",
      status: 400,
    };
  }
}

class NoInputModelError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify string 'model_name' ",
      status: 400,
    };
  }
}

class NoInputDatasetError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify string 'name'",
      status: 400,
    };
  }
}

class NoInputEmailError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify a valid string 'email'",
      status: 400,
    };
  }
}

class NoInputTokenNumberError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Invalid 'tokens' to recharge",
      status: 400,
    };
  }
}

class NoInputRoleError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify string 'role', you can pick 'admin' or 'user'",
      status: 400,
    };
  }
}

class InternalError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Ops, something went wrong",
      status: 500,
    };
  }
}

class RequestErrorJSON implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Ops, your json body has some syntax errors",
      status: 400,
    };
  }
}

class NoJSONRequest implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Your request body need to be a json object",
      status: 400,
    };
  }
}

class NoInputPasswordError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify string 'password'",
      status: 400,
    };
  }
}

class InputCredentialsNotValid implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Email or password not valid",
      status: 400,
    };
  }
}

class NoUserFoundError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "No user found with this username",
      status: 404,
    };
  }
}

class NoDatasetFoundError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "No dataset found with this name",
      status: 404,
    };
  }
}

class DatasetAlreadyExists implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Dataset already exists",
      status: 404,
    };
  }
}



class NoModelFoundError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Model not found",
      status: 404,
    };
  }
}

export class ErrorFactory {
  constructor() {}
  getError(type: ErrEnum): ErrorMessage {
    let error: ErrorMessage | null = null;
    switch (type) {
      case ErrEnum.AuthError:
        error = new AuthError();
        NoInputPasswordError;
        break;
      case ErrEnum.AdminAuthError:
        error = new AdminAuthError();
        break;
        case ErrEnum.DatasetAlreadyExists:
        error = new DatasetAlreadyExists();
        break;
        case ErrEnum.UserAlreadyExists:
        error = new UserAlreadyExists();
        break;
      case ErrEnum.NoInputPasswordError:
        error = new NoInputPasswordError();
        break;
      case ErrEnum.RequestErrorJSON:
        error = new RequestErrorJSON();
        break;
      case ErrEnum.NoInputModelError:
        error = new NoInputModelError();
        break;
      case ErrEnum.NoInputRoleError:
        error = new NoInputRoleError();
        break;
      
        case ErrEnum.NoInputKeywordsError:
        error = new NoInputKeywordsError();
        break;
        case ErrEnum.NoInputNumClassesError:
        error = new NoInputNumClassesError();
        break;
      case ErrEnum.NoInputEmailError:
        error = new NoInputEmailError();
        break;
      case ErrEnum.NoJSONRequest:
        error = new NoJSONRequest();
        break;
      case ErrEnum.NoInputTokenNumberError:
        error = new NoInputTokenNumberError();
        break;
      case ErrEnum.UserNotMatchError:
        error = new UserNotMatchError();
        break;
      case ErrEnum.NoInputDatasetError:
        error = new NoInputDatasetError();
        break;
      case ErrEnum.NoInputUsernameError:
        error = new NoInputUsernameError();
        break;
      case ErrEnum.InputCredentialsNotValid:
        error = new InputCredentialsNotValid();
        break;
      case ErrEnum.UserAlreadyExists:
        error = new UserAlreadyExists();
        break;
      case ErrEnum.ModelAlreadyExists:
        error = new ModelAlreadyExists();
        break;
      case ErrEnum.NoUserFoundError:
        error = new NoUserFoundError();
        break;
      case ErrEnum.NoDatasetFoundError:
        error = new NoDatasetFoundError();
        break;
      case ErrEnum.NoModelFoundError:
        error = new NoModelFoundError();
        break;
      default:
        error = new InternalError();
    }
    return error;
  }
}
