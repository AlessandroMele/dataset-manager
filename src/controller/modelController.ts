import { ModelTable } from "../model/tables/Models";
import { DatasetTable } from "../model/tables/Datasets";

var jwt = require("../middleware/util/jwtUtil");

import {
  SuccessEnum,
  ErrEnum,
  Response,
  formatResponse,
  formatResponseWithData,
} from "../responseFactory/util";
import { ErrorFactory } from "../responseFactory/Error";
import { SuccessFactory } from "../responseFactory/Success";

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();

//create model
export const create = async function (
  model: string,
  dataset: string,
  token: string,
  res: any
) {
  try {
    var payload = jwt.getPayload(token);
    var username: string = payload.payload.username;
    // search if the user has a model with the same name
    let user_model: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: model },
    });
    // if a model already exists
    if (user_model != null) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.ModelAlreadyExists).getMessage()
      );
    } else {
      //check if the user has a dataset with the same name passed in the body
      let user_dataset: DatasetTable | null = await DatasetTable.findOne({
        where: { user: username, name: dataset },
      });
      // if the dataset does not exists
      if (user_dataset == null) {
        formatResponse(
          res,
          errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
        );
      } else {
        // extract datasetId from the response
        let datasetId = user_dataset.getDataValue("id");
        console.log(datasetId);
        // insert the model in the table
        let results: ModelTable | null = await ModelTable.create({
          name: model,
          datasetId: datasetId,
          user: username,
        });
        formatResponseWithData(
          res,
          successFactory
            .getSuccess(SuccessEnum.ModelCreateSuccess)
            .getMessage(),
          { model: results }
        );
      }
    }
  } catch (error: any) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

//update model
export const update = function (req: any, res: any) {};

//remove model
export const remove = async function (model: string, token: string, res: any) {
  try {
    var payload = jwt.getPayload(token);
    var username: string = payload.payload.username;
    let userModelRemoved: number = await ModelTable.destroy({
      where: { user: username, name: model },
    });
    if (userModelRemoved == 0)
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
    else
      formatResponse(
        res,
        successFactory.getSuccess(SuccessEnum.RemovedSuccess).getMessage()
      );
  } catch (error: any) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

//list of models
export const list = async function (token: string, res: any) {
  try {
    // get email from token
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;
    let model_list: ModelTable[] | null = await ModelTable.findAll({
      where: { user: username },
    });
    if (model_list != null) {
      formatResponseWithData(
        res,
        successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
        { model_list: model_list }
      );
    } else {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
    }
  } catch (error: any) {
    formatResponseWithData(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage(),
      error
    );
  }
};

//load model's file
export const load = function (req: any, res: any) {};

//calculating inference of a specific image on a specific model
export const inference = function (req: any, res: any) {};
