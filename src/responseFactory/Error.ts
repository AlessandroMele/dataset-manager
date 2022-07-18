import { ErrEnum, Response } from "./util";

interface ErrorMessage {
  getMessage(): Response;
}

class UserAlreadyExists implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "User already exists",
      status: 409,
    };
  }
}

class NoInputFileModelError implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "Need to specify a valid 'fileName' (max 40 char)",
      status: 400,
    };
  }
}
class ModelFileExistsError implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "Model file already exists ",
      status: 409,
    };
  }
}

class NoInputImageError implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "Input fileName is not an image ",
      status: 400,
    };
  }
}
class NoInputZipError implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "Input fileName is not zip ",
      status: 400,
    };
  }
}

class NoInputKeywordsError implements ErrorMessage {
  getMessage(): Response {
    return {
      message:
        "You have to specify the 'keywords' array (max 30 char for element, no duplicates allowed)",
      status: 400,
    };
  }
}

class NoInputClassesError implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "You have to specify number 'classes' (max 120)",
      status: 400,
    };
  }
}

class NoInputClassNameError implements ErrorMessage {
  getMessage(): Response {
    return {
      message: "Need to specify a valid 'className' (max 30 char)",
      status: 400,
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
      message: "Users can only get their own residual token",
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
      message: "Need to specify a valid 'username' (max 30 char)",
      status: 400,
    };
  }
}

class NoInputModelError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify a valid 'modelName' (max 30 char)",
      status: 400,
    };
  }
}

class NoInputDatasetError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify a valid 'datasetName' (max 30 char)",
      status: 400,
    };
  }
}

class NoInputEmailError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify a valid string 'email' (max 50 char)",
      status: 400,
    };
  }
}

class NoModelFileFoundError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "No file found for this model",
      status: 404,
    };
  }
}

class NoInputTokenNumberError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify a valid 'token' number (max 10000)",
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
      message: "Your request body need to be a JSON object",
      status: 400,
    };
  }
}

class NoFormRequest implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Your request body need to be a Form",
      status: 400,
    };
  }
}

class NoInputPasswordError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify a valid 'password' (max 80 char)",
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
class NoInputMetadataError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "No input metadata",
      status: 400,
    };
  }
}

class DatasetAlreadyExists implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Dataset already exists",
      status: 409,
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

class NoInputValidBoundingBoxesError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message:
        "If you want to insert BoundingBoxes you need to specify normalized height, width and center",
      status: 400,
    };
  }
}

class NoInputImageIdentifierError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify a valid 'imagePath'",
      status: 400,
    };
  }
}

class LabelAlreadyExists implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "This image already has this label",
      status: 409,
    };
  }
}

class NoInputLabelListError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify an array ",
      status: 400,
    };
  }
}

class NoArrayKeywordsError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message:
        "You have to specify the 'keywords' array (max 30 char for element, no duplicates allowed)",
      status: 400,
    };
  }
}

class NotClassesNumberError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "'classes' need to be a number (max 120)",
      status: 400,
    };
  }
}

class NewModelNameFormatError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify a valid 'modelName' (max 30 char)",
      status: 400,
    };
  }
}

class ImageDoesNotExists implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "No image found with this 'imagePath'",
      status: 404,
    };
  }
}

class ImageAlreadyExists implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "In this dataset already exists an image with this name",
      status: 409,
    };
  }
}
class NewDatasetNameError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message: "Need to specify a valid 'newDatasetName' (max 30 char)",
      status: 400,
    };
  }
}

class ArrayKeywordsError implements ErrorMessage {
  public getMessage(): Response {
    return {
      message:
        "You have to specify the 'keywords' array (max 30 char for element, no duplicates allowed)",
      status: 400,
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
        break;
      case ErrEnum.NewDatasetNameError:
        error = new NewDatasetNameError();
        break;
      case ErrEnum.NoInputZipError:
        error = new NoInputZipError();
        break;
      case ErrEnum.NewModelNameFormatError:
        error = new NewModelNameFormatError();
        break;
      case ErrEnum.NoArrayKeywordsError:
        error = new NoArrayKeywordsError();
        break;
      case ErrEnum.NotClassesNumberError:
        error = new NotClassesNumberError();
        break;
      case ErrEnum.LabelAlreadyExists:
        error = new LabelAlreadyExists();
        break;
      case ErrEnum.AdminAuthError:
        error = new AdminAuthError();
        break;
      case ErrEnum.NoInputClassNameError:
        error = new NoInputClassNameError();
        break;
      case ErrEnum.ImageAlreadyExists:
        error = new ImageAlreadyExists();
        break;
      case ErrEnum.NoInputValidBoundingBoxesError:
        error = new NoInputValidBoundingBoxesError();
        break;
      case ErrEnum.DatasetAlreadyExists:
        error = new DatasetAlreadyExists();
        break;
      case ErrEnum.UserAlreadyExists:
        error = new UserAlreadyExists();
        break;
      case ErrEnum.NoInputImageIdentifierError:
        error = new NoInputImageIdentifierError();
        break;
      case ErrEnum.ArrayKeywordsError:
        error = new ArrayKeywordsError();
        break;
      case ErrEnum.NoInputPasswordError:
        error = new NoInputPasswordError();
        break;
      case ErrEnum.NoInputLabelListError:
        error = new NoInputLabelListError();
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
      case ErrEnum.NoInputImageError:
        error = new NoInputImageError();
        break;
      case ErrEnum.NoInputZipError:
        error = new NoInputImageError();
        break;
      case ErrEnum.NoInputKeywordsError:
        error = new NoInputKeywordsError();
        break;
      case ErrEnum.NoInputClassesError:
        error = new NoInputClassesError();
        break;
      case ErrEnum.NoInputEmailError:
        error = new NoInputEmailError();
        break;
      case ErrEnum.NoInputFileModelError:
        error = new NoInputFileModelError();
        break;
      case ErrEnum.NoInputMetadataError:
        error = new NoInputMetadataError();
        break;
      case ErrEnum.NoJSONRequest:
        error = new NoJSONRequest();
        break;
      case ErrEnum.NoFormRequest:
        error = new NoFormRequest();
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
      case ErrEnum.ModelFileExistsError:
        error = new ModelFileExistsError();
        break;
      case ErrEnum.NoModelFileFoundError:
        error = new NoModelFileFoundError();
        break;
      case ErrEnum.ImageDoesNotExists:
        error = new ImageDoesNotExists();
        break;
      default:
        error = new InternalError();
    }
    return error;
  }
}
