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
    UserAlreadyExists
}

export enum SuccessEnum {
    JWTSuccess,
    DefaultSuccess,
    UpdateSuccess,
    UserCreateSuccess
}

export interface Response {
    message: string, 
    status: number
}