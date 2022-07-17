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
    let userModel: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: model, deleted: false },
    });
    console.log("ciaociao11");
    // if a model already exists
    if (userModel != null) {
      console.log("ciaociao22");
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.ModelAlreadyExists).getMessage()
      );
    } else {
      //check if the user has a dataset with the same name passed in the body
      let userDataset: DatasetTable | null = await DatasetTable.findOne({
        where: { user: username, name: dataset, deleted: false },
      });
      // if the dataset does not exists
      if (userDataset == null) {
        formatResponse(
          res,
          errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
        );
      } else {
        // extract datasetId from the response
        let datasetId = userDataset.getDataValue("id");
        // insert the model in the table
        let results: ModelTable | null = await ModelTable.create({
          name: model,
          dataset: datasetId,
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
  } catch (err: any) {
    formatResponseWithData(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage(),
      err
    );
  }
};

//update all model's metadata
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
    // search if the user's model exists
    let user_model: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: modelName, deleted: false },
    });
    // model does not exists
    if (user_model == null) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
      //check if the dataset exists
    } else {
      let userDataset: DatasetTable | null = await DatasetTable.findOne({
        where: { user: username, name: datasetName, deleted: false },
      });
      //if exists, getting dataset id for updating name
      if (userDataset != null) {
        let datasetId = userDataset.getDataValue("id");
        await ModelTable.update(
          { name: newModelName, datasetId: datasetId },
          { where: { name: modelName, user: username, deleted: false } }
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
  } catch (error: any) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

//updating only dataset name of a specific model
export const updateDatasetName = async function (
  modelName: string,
  datasetName: string,
  token: string,
  res: any
) {
  try {
    var payload = jwt.getPayload(token);
    var username: string = payload.payload.username;
    // search if the user's model exists
    let user_model: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: modelName, deleted: false },
    });
    // model does not exists
    if (user_model == null) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
    }
    // checking if dataset already exists
    else {
      let userDataset: DatasetTable | null = await DatasetTable.findOne({
        where: { user: username, name: datasetName, deleted: false },
      });
      if (userDataset != null) {
        //update datasetName that matches datasetId
        let datasetId = userDataset.getDataValue("id");
        const result = await ModelTable.update(
          { datasetId: datasetId },
          { where: { name: modelName, user: username, deleted: false } }
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
  } catch (error: any) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

//updating only model name of a specific model
export const updateModelName = async function (
  modelName: string,
  newModelName: string,
  token: string,
  res: any
) {
  try {
    var payload = jwt.getPayload(token);
    var username: string = payload.payload.username;
    // search if the user's model exists
    let user_model: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: modelName, deleted: false },
    });
    // model does not exists
    if (user_model == null) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
      // checking if already exists a model with the new name
    } else {
      let results: ModelTable | null = await ModelTable.findOne({
        where: { name: newModelName, user: username },
      });
      // if it exists, error
      if (results != null) {
        formatResponse(
          res,
          errorFactory.getError(ErrEnum.ModelAlreadyExists).getMessage()
        );
      } else {
        //update only modelName
        const result = await ModelTable.update(
          { name: newModelName },
          { where: { name: modelName, user: username, deleted: false } }
        );
        formatResponse(
          res,
          successFactory.getSuccess(SuccessEnum.UpdateSuccess).getMessage()
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

//remove model
export const remove = async function (
  modelName: string,
  token: string,
  res: any
) {
  try {
    var payload = jwt.getPayload(token);
    var username: string = payload.payload.username;
    let userModelRemoved: number[] = await ModelTable.update(
      { deleted: true },
      { where: { user: username, name: modelName, deleted: false } }
    );
    if (userModelRemoved[0] == 0)
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
    let model_list: DatasetTable[] | null = await DatasetTable.findAll({
      // rename to datasetName
      attributes: [["name", "databaseName"]],
      where: { user: username, deleted: false },
      raw: true,
      include: [
        {
          model: ModelTable,
          // rename to modelName
          attributes: [["name", "modelName"], "path", "user"],
          where: {
            deleted: false,
          },
        },
      ],
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
    console.log(error);
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

//load model's file if it not exists
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
      where: { user: username, name: modelName, deleted: false },
    });
    if (!model) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
    } else {
      if (!model.getDataValue("path")) {
        let modelId: number = model.getDataValue("id");
        console.log(modelId);
        let file = files.fileName;
        let savePath = path.join(
          __dirname,
          "..",
          "..",
          "models",
          username,
          modelId.toString()
        );
        if (!fs.existsSync(savePath)) {
          fs.mkdirSync(savePath, { recursive: true });
        }
        const completePath: string = savePath + "/" + file.name;
        await file.mv(completePath);
        const final_path: string = path.join(
          "models",
          username,
          modelId.toString(),
          file.name
        );
        await ModelTable.update(
          { path: final_path },
          { where: { name: modelName, user: username } }
        );
        formatResponseWithData(
          res,
          successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
          {
            data: {
              path: final_path,
              fileName: files.fileName.name,
              modelName: modelName,
              status: "File loaded",
            },
          }
        );
      } else {
        formatResponse(
          res,
          errorFactory.getError(ErrEnum.ModelFileExistsError).getMessage()
        );
      }
    }
  } catch (err) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

//upgrade model file if already exists
export const updateFile = async function (
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
      where: { user: username, name: modelName, deleted: false },
    });
    if (!model) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
    } else {
      if (model.getDataValue("path")) {
        let modelId: number = model.getDataValue("id");
        console.log(modelId);
        let file = files.fileName;
        let savePath = path.join(
          __dirname,
          "..",
          "..",
          "models",
          username,
          modelId.toString()
        );
        if (!fs.existsSync(savePath)) {
          fs.mkdirSync(savePath, { recursive: true });
        }
        const completePath = savePath + "/" + file.name;
        await file.mv(completePath);
        const final_path: string = path.join(
          "models",
          username,
          modelId.toString(),
          file.name
        );
        await ModelTable.update(
          { path: final_path },
          { where: { name: modelName, user: username } }
        );
        formatResponseWithData(
          res,
          successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
          {
            data: {
              path: final_path,
              fileName: files.fileName.name,
              modelName: modelName,
              status: "File updated",
            },
          }
        );
      } else
        formatResponse(
          res,
          errorFactory.getError(ErrEnum.NoModelFileFoundError).getMessage()
        );
    }
  } catch (err) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

//calculating inference of a specific image on a specific model
export const inference = function (req: any, res: any) {};
