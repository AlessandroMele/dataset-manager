export enum ErrEnum {
    AuthError,
    CreateTokenErrorUsername,
    CreateTokenErrorRole,
    InternalError,
    AdminAuthError,
    NumberTokenNotValid,
    InputEmailNotValid,
    RequestErrorJSON,
    NoJSONRequest,
    InputPasswordNotValid,
    InputCredentialsNotValid,
    UserAlreadyExists,
    EmailNotMatchError,
    NoUserFoundError
}

export enum SuccessEnum {
    JWTSuccess,
    DefaultSuccess,
    UpdateSuccess,
    UserCreateSuccess,
    GetSuccess
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