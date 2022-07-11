export enum ErrEnum {
    AuthError,
    CreateTokenErrorUsername,
    CreateTokenErrorRole,
    InternalError,
    AdminAuthError,
    NumberTokenNotValid,
    InputEmailNotValid,
    RequestErrorJSON,
    NoJSONRequest
}

export enum SuccessEnum {
    JWTSuccess,
    DefaultSuccess,
    UpdateSuccess
}

export interface Response {
    message: string, 
    status: number
}