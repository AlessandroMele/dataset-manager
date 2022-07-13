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
    EmailNotMatchError,
    NoJSONRequest,
    InternalError,
    AdminAuthError,
    AuthError,
    RequestErrorJSON,
    ModelAlreadyExists,
    NoDatasetFoundError,
    NoModelFoundError
}


export enum SuccessEnum {
    JWTSuccess,
    DefaultSuccess,
    UpdateSuccess,
    UserCreateSuccess,
    GetSuccess,
    ModelCreateSuccess
}

export interface Response {
    message: string,
    status: number
}


export const formatResponse = (res: any, response: Response) => {
    res.status(response.status);
    res.json(response);
}

export const formatResponseWithData = (res: any, response: Response, data: Object) => {
    res.status(response.status);
    res.json(data);
}