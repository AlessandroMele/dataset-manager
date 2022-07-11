import {SuccessEnum, Response} from "./util"

interface  SuccessMsg {
    getMsg(): Response;
}

class JWTSuccess implements SuccessMsg {
    getMsg(): Response {
        return {message: "JWT Token created with success", status: 201};
    }
}

class UpdateSuccess implements SuccessMsg {
    getMsg(): Response {
        return {message: "Value correctly modified", status: 200};
    }
}

class DefaultSuccess implements SuccessMsg {
    getMsg(): Response {
        return {message: "Good results", status: 200};
    }
}



export class SuccessFactory {
    constructor(){}
    getSuccess (type:SuccessEnum):SuccessMsg{
        let success:SuccessMsg | null = null;
        switch (type){
            case SuccessEnum.JWTSuccess:
                success = new JWTSuccess();
                break;
            case SuccessEnum.UpdateSuccess:
                success = new UpdateSuccess();
                break;
            default:
                success = new DefaultSuccess();
        }
        UpdateSuccess
        return success;
    }
}