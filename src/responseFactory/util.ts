export enum ErrEnum {
  NoUserFoundError,
  NoInputTokenNumberError,
  NoInputRoleError,
  NoInputPasswordError,
  NoInputUsernameError,
  NoInputEmailError,
  NoInputModelError,
  NoInputDatasetError,
  UserAlreadyExists,
  InputCredentialsNotValid,
  UserNotMatchError,
  NoJSONRequest,
  InternalError,
  AdminAuthError,
  AuthError,
  RequestErrorJSON,
  ModelAlreadyExists,
  NoDatasetFoundError,
  NoModelFoundError,
  DatasetAlreadyExists,
  NoInputClassesError,
  NoInputKeywordsError,
  NoInputMetadataError,
  NoInputFileModelError,
  NoInputImageError,
  NoInputZipError,
  ModelFileExistsError,
  NoModelFileFoundError,
  NoFormRequest,
  NoInputClassNameError,
  NoInputValidBoundingBoxesError,
  NoInputImageIdentifierError,
  NoInputLabelListError,
  ImageDoesNotExists,
  LabelAlreadyExists,
  ImageAlreadyExists,
  NoArrayKeywordsError,
  NotClassesNumberError,
  NewModelNameFormatError,
  NewDatasetNameError,
  ArrayKeywordsError,
  NoImageFoundError,
  NoInputFileImageError,
}

export enum SuccessEnum {
  JWTSuccess,
  DefaultSuccess,
  UpdateSuccess,
  UserCreateSuccess,
  GetSuccess,
  ModelCreateSuccess,
  RemovedSuccess,
  DatasetCreateSuccess,
  LabelCreateSuccess,
  ImageInsertSuccess,
  InferenceSuccess,
}

export interface Response {
  message: string;
  status: number;
}

export const formatResponse = (res: any, response: Response) => {
  res.status(response.status);
  res.json(response);
};

export const formatResponseWithData = (
  res: any,
  response: Response,
  data: Object
) => {
  res.status(response.status);
  res.json(data);
};
