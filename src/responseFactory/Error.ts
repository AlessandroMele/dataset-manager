import {ErrEnum, Response} from'./util'

interface  ErrorMsg {
    getMsg(): Response;
}

class AuthError implements ErrorMsg {
    getMsg(): Response {
        return {message:'Unauthorized', status: 401};
    }
}

class AdminAuthError implements ErrorMsg {
    public getMsg(): Response {
        return {message:'Sorry, you are not the admin', status: 401};
    }
}

class CreateTokenErrorUsername implements ErrorMsg {
    public getMsg(): Response {
        return {message:'Need to specify string _username_ ', status: 400};
    }
}

class InputEmailNotValid implements ErrorMsg {
    public getMsg(): Response {
        return {message:'Need to specify string _email_', status: 400};
    }
}

class NumberTokenNotValid implements ErrorMsg {
    public getMsg(): Response {
        return {message:'Need to specify number of _token_', status: 400};
    }
}

class CreateTokenErrorRole implements ErrorMsg {
    public getMsg(): Response {
        return {message:'Need to specify string _role_, you can pick _admin_ or _user_', status: 400};
    }
}

class InternalError implements ErrorMsg {
    public getMsg(): Response {
        return {message:'Ops, something gone wrong', status: 500};
    }
}

class RequestErrorJSON implements ErrorMsg {
    public getMsg(): Response {
        return {message:'Ops, your json body has some syntax errors', status: 400};
    }
}

class NoJSONRequest implements ErrorMsg {
    public getMsg(): Response {
        return {message:'Your request body need to be a json object', status: 400};
    }
}


export class ErrorFactory {
    constructor(){}
    getError (type:ErrEnum):ErrorMsg{
        let error:ErrorMsg | null = null;
        switch (type){
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
            case ErrEnum.CreateTokenErrorRole:
                error = new CreateTokenErrorRole();
                break;
            default:
                error = new InternalError();
        }
        
        return error;
    }
}