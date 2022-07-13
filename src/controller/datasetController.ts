import { ModelTable } from "../model/tables/Models";
import { DatasetTable } from "../model/tables/Datasets";

let jwt = require("../middleware/util/jwtUtil");

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

//create dataset
export const create = async function (
  datasetName: string,
  numClasses: string,
  keywords: string,
  token: string,
  res: any
) {
  try {
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;
    // search if the user has a dataset with the same name
    let user_dataset: DatasetTable | null = await DatasetTable.findOne({
      where: { user: username, name: datasetName },
    });

    console.log(user_dataset, datasetName)
    // if a dataset already exists
    if (user_dataset != null) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.DatasetAlreadyExists).getMessage()
      );
    } else {
      let results: DatasetTable | null = await DatasetTable.create({
        name: datasetName,
        classes: numClasses,
        keywords: keywords,
        user: username
      });
      formatResponseWithData(
        res,
        successFactory.getSuccess(SuccessEnum.ModelCreateSuccess).getMessage(),
        { model: results }
      );
    }
  } catch (error: any) {
    formatResponseWithData(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage(), error
    );
  }
};

//remove model
export const remove = async function (
  dataset: string,
  token: string,
  res: any
) {
  try {
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;
    let userDatasetRemoved: number = await DatasetTable.destroy({
      where: { user: username, name: dataset },
    });
    if (userDatasetRemoved == 0)
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
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
    let dataset_list: DatasetTable[] | null = await DatasetTable.findAll({
      where: { user: username },
    });
    if (dataset_list != null) {
      formatResponseWithData(
        res,
        successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
        { dataset_list: dataset_list }
      );
    } else {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
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

//load dataset's file
export const load = function (req: any, res: any) {};

//update dataset
export const update = function (req: any, res: any) {};

//insert a single image on the specified dataset
export const imageInsert = function (req: any, res: any) {};

//insert a zip images on the specified dataset
export const zipInsert = function (req: any, res: any) {};

//insert a label on a specific image on the specified dataset
export const labelInsert = function (req: any, res: any) {};
