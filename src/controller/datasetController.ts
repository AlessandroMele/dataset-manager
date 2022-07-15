import { DatasetTable } from "../model/tables/Datasets";

const jwt = require("../middleware/util/jwtUtil");

import {
  SuccessEnum,
  ErrEnum,
  Response,
  formatResponse,
  formatResponseWithData,
} from "../responseFactory/util";
import { ErrorFactory } from "../responseFactory/Error";
import { SuccessFactory } from "../responseFactory/Success";
import { KeywordTable } from "../model/tables/Keywords";
import { checKeywords } from "middleware/dataset";

const path = require("path");
const fs = require("fs");
const unzipper = require("unzipper");

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();

//create dataset
export const create = async function (
  datasetName: string,
  classes: string,
  keywords: string[],
  token: string,
  res: any
) {
  try {
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;
    // search if the user has a dataset with the same name
    let user_dataset: DatasetTable | null = await DatasetTable.findOne({
      where: { user: username, name: datasetName, deleted: false },
    });
    // if a dataset already exists
    if (user_dataset != null) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.DatasetAlreadyExists).getMessage()
      );
    } else {
      //dataset creation
      const dataset = await DatasetTable.create({
        name: datasetName,
        classes: classes,
        user: username,
      });
      keywords.forEach(async (kw) => {
        await KeywordTable.create({
          keyword: kw,
          dataset: dataset.getDataValue("id"),
        });
      });
      formatResponse(
        res,
        successFactory.getSuccess(SuccessEnum.DatasetCreateSuccess).getMessage()
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
    // get  from token
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;
    let datasetList: DatasetTable[] | null = await DatasetTable.findAll({
      where: { user: username, deleted: false },
      include: [
        {
          model: KeywordTable,
          where: {
            deleted: false,
          },
        },
      ],
    });
    if (datasetList != null) {
      formatResponseWithData(
        res,
        successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
        { datasetList: datasetList }
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

//insert a single image on the specified dataset
export const imageInsert = async function (req: any, token: string, res: any) {
  try {
    // get username from token
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;
    let datasetName = req.body.datasetName;
    let dataset: DatasetTable | null = await DatasetTable.findOne({
      where: { user: username, name: datasetName },
    });
    if (!dataset) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
      );
    } else {
      let file = req.files.fileName;
      let savePath = path.join(
        __dirname,
        "..",
        "..",
        "datasets",
        username,
        datasetName
      );
      if (!fs.existsSync(savePath)) {
        console.log(savePath);
        fs.mkdirSync(savePath, { recursive: true });
      }
      await file.mv(savePath + "/" + file.name);
      await DatasetTable.update(
        { path: savePath },
        { where: { name: datasetName, user: username } }
      );
      formatResponseWithData(
        res,
        successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
        {
          data: {
            fileName: req.files.fileName.name,
            mimetype: req.files.fileName.mimetype,
            datasetName: datasetName,
          },
        }
      );
    }
  } catch (err) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

//insert a zip images on the specified dataset
export const zipInsert = async function (req: any, token: string, res: any) {
  try {
    // get username from token
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;
    let datasetName = req.body.datasetName;
    let dataset: DatasetTable | null = await DatasetTable.findOne({
      where: { user: username, name: datasetName },
    });
    if (!dataset) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
      );
    } else {
      let file = req.files.fileName;
      let savePath = path.join(
        __dirname,
        "..",
        "..",
        "datasets",
        username,
        datasetName
      );
      if (!fs.existsSync(savePath)) {
        console.log(savePath);
        fs.mkdirSync(savePath, { recursive: true });
      }
      console.log(req.files.fileName);
      //scompattare lo zip e controllare che ogni file sia un'immagine, poi prosegui
      fs.createReadStream(req.files.fileName.tempFilePath + "/" + file.name)
        .pipe(unzipper.parse())
        .on("entry", async function (entry: any) {
          await entry.pipe(fs.createWriteStream(savePath + "/" + file.name));
        });

      await DatasetTable.update(
        { path: savePath },
        { where: { name: datasetName, user: username } }
      );
      formatResponseWithData(
        res,
        successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
        {
          data: {
            fileName: req.files.fileName.name,
            mimetype: req.files.fileName.mimetype,
            datasetName: datasetName,
          },
        }
      );
    }
  } catch (err) {
    console.log(err);
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

//insert a label on a specific image on the specified dataset
export const labelInsert = function (req: any, token: string, res: any) {};

//update dataset
export const update = function (req: any, res: any) {};
