import { ModelTable } from "../model/tables/Models";
import { DatasetTable } from "../model/tables/Datasets";
import { UserTable } from "../model/tables/Users";

const jwt = require("../middleware/util/jwtUtil");
const path = require("path");
const fs = require("fs");
const spawn = require("child_process").spawn;

import {
  SuccessEnum,
  ErrEnum,
  formatResponse,
  formatResponseWithData,
} from "../responseFactory/util";
import { ErrorFactory } from "../responseFactory/Error";
import { SuccessFactory } from "../responseFactory/Success";

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();

/**
 * Insert new model in the database
 * @param model name of the model
 * @param dataset linked to model
 * @param token of the user
 * @param res response
 */
export const create = async function (
  model: string,
  dataset: string,
  token: string,
  res: any
) {
  try {
    //extracting username
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;

    // search if the user has a model with the same name
    let userModel: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: model, deleted: false },
    });
    //if model already exists, error
    if (userModel != null) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.ModelAlreadyExists).getMessage()
      );
      //if model not exists, continue
    } else {
      //check if the user has a dataset with the same name passed in the body
      let userDataset: DatasetTable | null = await DatasetTable.findOne({
        where: { user: username, name: dataset, deleted: false },
      });
      //if the dataset does not exists, error
      if (userDataset == null) {
        formatResponse(
          res,
          errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
        );
        //if dataset exists, now it's possible to insert the new model
      } else {
        // extract datasetId from the response
        let datasetId = userDataset.getDataValue("id");

        // insert the model in the table
        let results: ModelTable | null = await ModelTable.create({
          name: model,
          dataset: datasetId,
          user: username,
        });
        //success
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

/**
 * update all model's metadata
 * @param modelName name of the model
 * @param newModelName new name of the model
 * @param datasetName name of the dataset linked to model
 * @param token of the user
 * @param res response
 */
export const updateMetadata = async function (
  modelName: string,
  newModelName: string,
  datasetName: string,
  token: string,
  res: any
) {
  try {
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;

    // search if the user's model exists
    let userModel: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: modelName, deleted: false },
    });
    // if the model does not exists, error
    if (userModel == null) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
      //check if the dataset exists
    } else {
      let userDataset: DatasetTable | null = await DatasetTable.findOne({
        where: { user: username, name: datasetName, deleted: false },
      });
      //if dataset exists, getting id for updating model name
      if (userDataset != null) {
        let datasetId = userDataset.getDataValue("id");
        await ModelTable.update(
          { name: newModelName, dataset: datasetId },
          { where: { name: modelName, user: username, deleted: false } }
        );
        //success
        formatResponse(
          res,
          successFactory.getSuccess(SuccessEnum.UpdateSuccess).getMessage()
        );
        //no dataset found, error
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

/**
 * updating only dataset name of a specific model
 * @param modelName name of the model
 * @param datasetName new name of the dataset linked to model
 * @param token of the user
 * @param res response
 */
export const updateDatasetName = async function (
  modelName: string,
  datasetName: string,
  token: string,
  res: any
) {
  try {
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;

    // search if the user's model exists
    let userModel: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: modelName, deleted: false },
    });
    // model does not exists
    if (userModel == null) {
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
          { dataset: datasetId },
          { where: { name: modelName, user: username, deleted: false } }
        );
        //success
        formatResponse(
          res,
          successFactory.getSuccess(SuccessEnum.UpdateSuccess).getMessage()
        );
        //error
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

/**
 * updating only model name of a specific model
 * @param modelName name of the model
 * @param newModelName new name of the model
 * @param token of the user
 * @param res response
 */
export const updateModelName = async function (
  modelName: string,
  newModelName: string,
  token: string,
  res: any
) {
  try {
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;

    // search if the user's model exists
    let userModel: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: modelName, deleted: false },
    });
    // model does not exists
    if (userModel == null) {
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
        //success
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

/**
 * deleting model
 * @param modelName name of the model
 * @param token of the user
 * @param res response
 */
export const remove = async function (
  modelName: string,
  token: string,
  res: any
) {
  try {
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;

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

/**
 * List of all models
 * @param token of the user
 * @param res response
 */
export const list = async function (token: string, res: any) {
  try {
    // get username from token
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;

    //join for getting all info about model's list
    let modelList: DatasetTable[] | null = await DatasetTable.findAll({
      // rename name to datasetName (AS)
      attributes: [["name", "datasetName"]],
      where: { user: username, deleted: false },
      raw: true,
      include: [
        {
          model: ModelTable,
          // rename name to modelName (AS)
          attributes: [["name", "modelName"], "path", "user"],
          where: {
            deleted: false,
          },
        },
      ],
    });
    //if there's something, it's ok
    if (modelList != null) {
      formatResponseWithData(
        res,
        successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
        { modelList: modelList }
      );
    } else {
      //error
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
    }
  } catch (error: any) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

/**
 * load model's file (if not exists)
 * @param files file to upload
 * @param modelName name of the model
 * @param token of the user
 * @param res response
 */
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

    //searching if model exists
    let model: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: modelName, deleted: false },
    });
    if (!model) {
      //error, model not found
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
      //if model exists, continue
    } else {
      //checking if file model already exists
      if (!model.getDataValue("path")) {
        let modelId: number = model.getDataValue("id");
        let file = files.fileName;

        //building path creating directories
        let savePath = path.join(
          __dirname,
          "..",
          "..",
          "models",
          username,
          modelId.toString()
        );
        //creating directories if they don't exists
        if (!fs.existsSync(savePath)) {
          fs.mkdirSync(savePath, { recursive: true });
        }
        //path to save file
        const completePath: string = savePath + "/" + file.name;

        //move file to the complete path
        await file.mv(completePath);

        const finalPath: string = path.join(
          "models",
          username,
          modelId.toString(),
          file.name
        );
        //updating path in db
        await ModelTable.update(
          { path: finalPath },
          { where: { name: modelName, user: username } }
        );
        //success
        formatResponseWithData(
          res,
          successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
          {
            data: {
              path: finalPath,
              fileName: files.fileName.name,
              modelName: modelName,
              status: "File loaded",
            },
          }
        );
        //if the model file already exists
      } else {
        formatResponse(
          res,
          errorFactory.getError(ErrEnum.ModelFileExistsError).getMessage()
        );
      }
    }
  } catch (err: any) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

/**
 * update model file if already exists
 * @param files file to update
 * @param modelName name of the model
 * @param token of the user
 * @param res response
 */
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

    //checking if model exists
    let model: ModelTable | null = await ModelTable.findOne({
      where: { user: username, name: modelName, deleted: false },
    });
    //if not, error
    if (!model) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
      );
      //if exists, continue
    } else {
      //if path already exists
      if (model.getDataValue("path")) {
        let modelId: number = model.getDataValue("id");
        let file = files.fileName;
        //folder where to save file
        let savePath = path.join(
          __dirname,
          "..",
          "..",
          "models",
          username,
          modelId.toString()
        );

        //creating directories if they don't exist
        if (!fs.existsSync(savePath)) {
          fs.mkdirSync(savePath, { recursive: true });
        }

        //path where to save file
        const completePath = savePath + "/" + file.name;
        //moving file
        await file.mv(completePath);
        //updating db
        const finalPath: string = path.join(
          "models",
          username,
          modelId.toString(),
          file.name
        );
        await ModelTable.update(
          { path: finalPath },
          { where: { name: modelName, user: username } }
        );
        //success
        formatResponseWithData(
          res,
          successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
          {
            data: {
              path: finalPath,
              fileName: files.fileName.name,
              modelName: modelName,
              status: "File updated",
            },
          }
        );
        //error
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

/**
 * calculating inference of a specific image on a specific model
 * @param files file to pass at the model
 * @param modelName name of the model
 * @param token of the user
 * @param res response
 */
export const inference = async function (
  files: any,
  modelName: string,
  token: string,
  res: any
) {
  try {
    // get username from token
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;

    // search user tokens
    let user: UserTable | null = await UserTable.findOne({
      where: { username: username },
    });
    let userTokens: number = user?.getDataValue("token");
    // error if token are not sufficients, error
    if (userTokens < 5) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.AuthError).getMessage()
      );
      //if not, continue
    } else {
      //updating db
      await UserTable.update(
        {
          token: userTokens - 5,
        },
        { where: { username: username } }
      );
      //searching if model exists
      let model: ModelTable | null = await ModelTable.findOne({
        where: { user: username, name: modelName, deleted: false },
      });
      //if model not exists, error
      if (!model) {
        formatResponse(
          res,
          errorFactory.getError(ErrEnum.NoModelFoundError).getMessage()
        );
      } else {
        //if model exists, checking if model file exists
        let modelPath: string = model.getDataValue("path");
        if (modelPath) {
          let image: any = files.fileName;
          let completePath: string = path.join(
            __dirname,
            "..",
            "..",
            modelPath
          );
          //launch a Python istance for inference on model
          const pythonModel = spawn("python", [completePath, image]);
          let resp: string = "";
          pythonModel.stdout.on("close", function () {
            try {
              formatResponseWithData(
                res,
                successFactory
                  .getSuccess(SuccessEnum.InferenceSuccess)
                  .getMessage(),
                {
                  inference: [resp],
                }
              );
            } catch {
              formatResponse(
                res,
                errorFactory.getError(ErrEnum.InternalError).getMessage()
              );
            }
          });
          pythonModel.stdout.on("data", function (data: any) {
            try {
              resp = JSON.parse(data.toString().replace(/'/g, '"'));
            } catch {}
          });
        }
      }
    }
  } catch (err) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};
