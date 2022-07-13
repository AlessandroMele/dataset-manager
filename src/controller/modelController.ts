import {ModelTable} from "../model/tables/Models";
import {DatasetTable} from "../model/tables/Datasets";
import {UserTable} from "../model/tables/Users";

var jwt = require("../middleware/util/jwtUtil");

import {SuccessEnum, ErrEnum, Response, formatResponse, formatResponseWithData} from '../responseFactory/util';
import {ErrorFactory} from "../responseFactory/Error";
import {SuccessFactory} from "../responseFactory/Success";

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();


//create model
export const create = async function (model: string, dataset: string, token: string, res: any) {
    try {
        var payload = jwt.getPayload(token);
        var email: string = payload.payload.email;
        // search if the user has a model with the same name
        let user_model: UserTable | null = await UserTable.findOne({
            where: {email: email},
            include: [{
                model: ModelTable,
                required: true,
                where: {name: model}
            }]
        });
        // if a model already exists
        if (user_model != null) {
            formatResponse(res, errorFactory.getError(ErrEnum.ModelAlreadyExists).getMessage())
        }
        else {
            //check if the user has a dataset with the same name passed in the body
            let user_dataset: any = await UserTable.findOne({
                // returns plain json
                raw: true,
                where: {email: email},
                include: [{
                    model: DatasetTable,
                    required: true,
                    where: {name: dataset}
                }]
            });
            // if the dataset does not exists
            if (user_dataset == null) {
                formatResponse(res, errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage())
            }
            else {
                // extract userId and datasetId from the response
                let userId = user_dataset["id"];
                let datasetId = user_dataset["datasets.id"];
                // insert the model in the table
                let results: ModelTable | null = await ModelTable.create({
                    name: model,
                    datasetId: datasetId,
                    userId: userId
                });
                formatResponseWithData(res, successFactory.getSuccess(SuccessEnum.ModelCreateSuccess).getMessage(), {"model": results})
            }
        }
    } catch (error: any) {
        formatResponse(res, errorFactory.getError(ErrEnum.InternalError).getMessage())
    }
};

//update model
export const update = function (req: any, res: any) {

};

//delete model
export const remove = function (req: any, res: any) {

};

//list of models
export const list = async function (token: string, res: any) {
    try {
        // get email from token
        let payload = jwt.getPayload(token);
        let email: string = payload.payload.email;
        // get userId from db by email 
        let user: any = await UserTable.findOne({where: {email: email}});
        let userId: number = user["id"];
        // get list of models by userId
        let model_list: ModelTable[] | null = await ModelTable.findAll({where: {userId: userId}});
        if (model_list != null) {
            formatResponseWithData(res, successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(), {"model_list": model_list})
        }
        else {
            formatResponse(res, errorFactory.getError(ErrEnum.NoModelFoundError).getMessage())
        }
    } catch (err: any) {
        formatResponse(res, errorFactory.getError(ErrEnum.InternalError).getMessage())
    }
};

//load model's file
export const load = function (req: any, res: any) {

};

//calculating inference of a specific image on a specific model
export const inference = function (req: any, res: any) {

};