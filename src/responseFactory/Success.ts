import {SuccessEnum, Response} from "./util"

interface SuccessMessage {
    getMessage (): Response;
}

class UserCreateSuccess implements SuccessMessage {
    getMessage (): Response {
        return {
            message: "User created with success",
            status: 201
        };
    }
}

class JWTSuccess implements SuccessMessage {
    getMessage (): Response {
        return {
            message: "JWT Token created with success",
            status: 201
        };
    }
}

class UpdateSuccess implements SuccessMessage {
    getMessage (): Response {
        return {
            message: "Value correctly modified",
            status: 200
        };
    }
}

class GetSuccess implements SuccessMessage {
    getMessage (): Response {
        return {
            message: "Ok get",
            status: 200
        };
    }
}

class DefaultSuccess implements SuccessMessage {
    getMessage (): Response {
        return {
            message: "Good results",
            status: 200
        };
    }
}



export class SuccessFactory {
    constructor () {}
    getSuccess (type: SuccessEnum): SuccessMessage {
        let success: SuccessMessage | null = null;
        switch (type) {
            case SuccessEnum.JWTSuccess:
                success = new JWTSuccess();
                break;
            case SuccessEnum.GetSuccess:
                success = new GetSuccess();
                break;
            case SuccessEnum.UpdateSuccess:
                success = new UpdateSuccess();
                break;
            case SuccessEnum.UserCreateSuccess:
                success = new UserCreateSuccess();
                break;
            default:
                success = new DefaultSuccess();

        }
        return success;
    }
}