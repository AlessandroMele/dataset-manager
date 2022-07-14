import { ModelTable } from "../model/tables/Models";
import { DatasetTable } from "../model/tables/Datasets";

var jwt = require("../middleware/util/jwtUtil");
var path = require("path");
const fs = require("fs");
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

//update model's metadata
export const updateMetadata = async function (
  modelName: string,
  newModelName: string,
  datasetName: string,
  token: string,
  res: any
) {
  try {
    var payload = jwt.getPayload(token);
    var username: string = payload.payload.username;
    // search if the user has a model with the same name
    let user_model: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: modelName },
    });
    // model does not exists
    if (user_model == null) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
    } else {
      if (newModelName && datasetName) {
        let userDataset: DatasetTable | null = await DatasetTable.findOne({
          where: { user: username, name: datasetName },
        });
        if (userDataset != null) {
          let datasetId = userDataset.getDataValue("datasetId");
          const result = await ModelTable.update(
            { name: newModelName, datasetId: datasetId },
            { where: { name: modelName, user: username } }
          );
          formatResponse(
            res,
            successFactory.getSuccess(SuccessEnum.UpdateSuccess).getMessage()
          );
        } else {
          formatResponse(
            res,
            errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
          );
        }
      }
      //check if new name already exists
      else if (newModelName) {
        let results: ModelTable | null = await ModelTable.findOne({
          where: { name: newModelName, user: username },
        });
        if (results != null) {
          formatResponse(
            res,
            errorFactory.getError(ErrEnum.ModelAlreadyExists).getMessage()
          );
        } else {
          //update only modelName
          const result = await ModelTable.update(
            { name: newModelName },
            { where: { name: modelName, user: username } }
          );
          formatResponse(
            res,
            successFactory.getSuccess(SuccessEnum.UpdateSuccess).getMessage()
          );
        }
      } else if (datasetName) {
        let userDataset: DatasetTable | null = await DatasetTable.findOne({
          where: { user: username, name: datasetName },
        });
        if (userDataset != null) {
          //update only datasetId
          let datasetId = userDataset.getDataValue("datasetId");
          const result = await ModelTable.update(
            { datasetId: datasetId },
            { where: { name: modelName, user: username } }
          );
          formatResponse(
            res,
            successFactory.getSuccess(SuccessEnum.UpdateSuccess).getMessage()
          );
        } else {
          formatResponse(
            res,
            errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
          );
        }
      }
    }
  } catch (error: any) {
    formatResponseWithData(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage(),
      error
    );
  }
};
//remove model
export const remove = async function (
  modelName: string,
  token: string,
  res: any
) {
  try {
    var payload = jwt.getPayload(token);
    var username: string = payload.payload.username;
    let userModelRemoved: number = await ModelTable.destroy({
      where: { user: username, name: modelName },
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
    // get username from token
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
export const loadFile = async function (
  files: any,
  modelName: string,
  token: string,
  res: any
) {
  try {
    // get username from token
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;
    let model: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: modelName },
    });
    if (!model) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
    } else {
      let file = files.fileName;
      let savePath = path.join(__dirname, "..", "..", "models", username);
      if (!fs.existsSync(savePath)) {
        console.log(savePath);
        fs.mkdirSync(savePath, { recursive: true });
      }
      await file.mv(savePath + "/" + file.name);
      const result = await ModelTable.update(
        { path: savePath },
        { where: { name: modelName, user: username } }
      );
      formatResponseWithData(
        res,
        successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
        {
          data: {
            fileName: files.fileName.name,
            mimetype: files.fileName.mimetype,
            modelName: modelName,
          },
        }
      );
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
//calculating inference of a specific image on a specific model
export const updateFile = function (req: any, res: any) {};

//calculating inference of a specific image on a specific model
export const inference = function (req: any, res: any) {};
