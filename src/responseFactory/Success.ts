import { SuccessEnum, Response } from "./util";

interface SuccessMessage {
  getMessage(): Response;
}

class UserCreateSuccess implements SuccessMessage {
  getMessage(): Response {
    return {
      message: "User created with success",
      status: 201,
    };
  }
}

class InferenceSuccess implements SuccessMessage {
  getMessage(): Response {
    return {
      message: "Inference done with success",
      status: 201,
    };
  }
}

class RemovedSuccess implements SuccessMessage {
  getMessage(): Response {
    return {
      message: "Item has been removed successfully",
      status: 200,
    };
  }
}

class DatasetCreateSuccess implements SuccessMessage {
  getMessage(): Response {
    return {
      message: "Dataset has been created with success",
      status: 201,
    };
  }
}

class ModelCreateSuccess implements SuccessMessage {
  getMessage(): Response {
    return {
      message: "Model created with success",
      status: 201,
    };
  }
}

class JWTSuccess implements SuccessMessage {
  getMessage(): Response {
    return {
      message: "JWT Token created with success",
      status: 201,
    };
  }
}

class UpdateSuccess implements SuccessMessage {
  getMessage(): Response {
    return {
      message: "Value correctly modified",
      status: 200,
    };
  }
}

class GetSuccess implements SuccessMessage {
  getMessage(): Response {
    return {
      message: "Ok get",
      status: 200,
    };
  }
}

class DefaultSuccess implements SuccessMessage {
  getMessage(): Response {
    return {
      message: "Good results",
      status: 200,
    };
  }
}

class LabelCreateSuccess implements SuccessMessage {
  getMessage(): Response {
    return {
      message: "Label created with success",
      status: 200,
    };
  }
}

class ImageInsertSuccess implements SuccessMessage {
  getMessage(): Response {
    return {
      message: "Image inserted with success",
      status: 200,
    };
  }
}

export class SuccessFactory {
  constructor() {}
  getSuccess(type: SuccessEnum): SuccessMessage {
    let success: SuccessMessage | null = null;
    switch (type) {
      case SuccessEnum.JWTSuccess:
        success = new JWTSuccess();
        break;
      case SuccessEnum.ImageInsertSuccess:
        success = new ImageInsertSuccess();
        break;
      case SuccessEnum.GetSuccess:
        success = new GetSuccess();
        break;
      case SuccessEnum.DatasetCreateSuccess:
        success = new DatasetCreateSuccess();
        break;
      case SuccessEnum.InferenceSuccess:
        success = new InferenceSuccess();
        break;
      case SuccessEnum.UpdateSuccess:
        success = new UpdateSuccess();
        break;
      case SuccessEnum.UserCreateSuccess:
        success = new UserCreateSuccess();
        break;
      case SuccessEnum.ModelCreateSuccess:
        success = new ModelCreateSuccess();
        break;
      case SuccessEnum.RemovedSuccess:
        success = new RemovedSuccess();
        break;
      case SuccessEnum.LabelCreateSuccess:
        success = new LabelCreateSuccess();
        break;
      default:
        success = new DefaultSuccess();
    }
    return success;
  }
}
