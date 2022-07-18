import { DatasetTable } from "../model/tables/Datasets";

const jwt = require("../middleware/util/jwtUtil");

import {
  SuccessEnum,
  ErrEnum,
  formatResponse,
  formatResponseWithData,
} from "../responseFactory/util";
import { ErrorFactory } from "../responseFactory/Error";
import { SuccessFactory } from "../responseFactory/Success";
import { KeywordTable } from "../model/tables/Keywords";
import { ImageTable } from "../model/tables/Images";
import { LabelTable } from "../model/tables/Labels";
import { ModelTable } from "../model/tables/Models";
import { UserTable } from "../model/tables/Users";

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
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

//remove model
export const remove = async function (
  datasetName: string,
  token: string,
  res: any
) {
  try {
    var payload = jwt.getPayload(token);
    var username: string = payload.payload.username;
    // extract dataset data
    let user_dataset: DatasetTable | null = await DatasetTable.findOne({
      where: { user: username, name: datasetName, deleted: false },
    });
    // error if dataset does not exists
    if (!user_dataset) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
      );
    } else {
      let datasetId: number = user_dataset.getDataValue("id");
      // delete the dataset
      await DatasetTable.update(
        { deleted: true },
        { where: { user: username, name: datasetName, deleted: false } }
      );
      //delete associated models, images and keywords
      await ModelTable.update(
        { deleted: true },
        { where: { dataset: datasetId, deleted: false } }
      );
      await ImageTable.update(
        { deleted: true },
        { where: { dataset: datasetId, deleted: false } }
      );

      await KeywordTable.update(
        { deleted: true },
        { where: { dataset: datasetId, deleted: false } }
      );

      formatResponse(
        res,
        successFactory.getSuccess(SuccessEnum.RemovedSuccess).getMessage()
      );
    }
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
      attributes: ["name", "classes", "user"],
      where: { user: username, deleted: false },
      include: [
        {
          model: KeywordTable,
          attributes: ["keyword"],
          required: false,
          where: {
            deleted: false,
          },
        },
        {
          model: ImageTable,
          attributes: ["id", "path"],
          required: false,
          where: {
            deleted: false,
          },
          include: [
            {
              model: LabelTable,
              attributes: ["label", "width", "center", "height"],
              required: false,
              where: {
                deleted: false,
              },
            },
          ],
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
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
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
    // search user tokens
    let user: UserTable | null = await UserTable.findOne({
      where: { username: username },
    });
    let userTokens: number = user?.getDataValue("token");
    // error if token are not sufficients
    if (userTokens < 0.1) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.AuthError).getMessage()
      );
    } else {
      await UserTable.update(
        {
          token: userTokens - 0.1,
        },
        { where: { username: username } }
      );
      // search if dataset exixts
      let dataset: DatasetTable | null = await DatasetTable.findOne({
        where: { user: username, name: datasetName, deleted: false },
      });
      // error if doesn't exists
      if (!dataset) {
        formatResponse(
          res,
          errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
        );
      } else {
        // get the datasetId
        let datasetId: number = dataset.getDataValue("id");
        // extract image from the form
        let file = req.files.fileName;
        // create path for the image
        let savePath = path.join(
          __dirname,
          "..",
          "..",
          "datasets",
          username,
          datasetName,
          datasetId.toString() // needed to avoid collisions when dataset is deleted and recreated
        );

        // create the path to store in the database
        const final_path: string = path.join(
          "datasets",
          username,
          datasetName,
          datasetId.toString(),
          file.name
        );
        // check if the image already exists
        let image: ImageTable | null = await ImageTable.findOne({
          where: {
            dataset: datasetId,
            path: final_path,
            deleted: false,
          },
        });
        // if it exists return error
        if (image) {
          formatResponse(
            res,
            errorFactory.getError(ErrEnum.ImageAlreadyExists).getMessage()
          );
        } else {
          await ImageTable.create({
            dataset: datasetId,
            path: final_path,
          });
          await DatasetTable.update(
            {
              path: final_path,
            },
            { where: { name: datasetName, user: username } }
          );

          // if the directory doesn't exists create it
          if (!fs.existsSync(savePath)) {
            fs.mkdirSync(savePath, { recursive: true });
          }
          // insert the image in the directory created
          await file.mv(savePath + "/" + file.name);

          formatResponseWithData(
            res,
            successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
            {
              data: {
                path: final_path,
                fileName: req.files.fileName.name,
                datasetName: datasetName,
                status: "Image loaded",
              },
            }
          );
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
        fs.mkdirSync(savePath, { recursive: true });
      }
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
            status: "Image  loaded",
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

//insert a label on a specific image
export const labelInsert = async function (
  imagePath: string,
  className: any,
  height: number,
  width: number,
  center: number,
  token: string,
  res: any
) {
  try {
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;
    // search user tokens
    let user: UserTable | null = await UserTable.findOne({
      where: { username: username },
    });
    let userTokens: number = user?.getDataValue("token");
    // error if token are not sufficients
    if (userTokens < 0.05) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.AuthError).getMessage()
      );
    } else {
      await UserTable.update(
        {
          token: userTokens - 0.05,
        },
        { where: { username: username } }
      );
      // check if the user has an image with this path
      let image: DatasetTable | null = await DatasetTable.findOne({
        where: {
          user: username,
          deleted: false,
        },
        include: [
          {
            model: ImageTable,
            required: true,
            where: {
              path: imagePath,
              deleted: false,
            },
          },
        ],
      });
      // if images does not exists
      if (!image) {
        formatResponse(
          res,
          errorFactory.getError(ErrEnum.ImageDoesNotExists).getMessage()
        );
      } else {
        // if values are undefined, they are set to true
        let widthReal = width ? width : null;
        let heightReal = height ? height : null;
        let centerReal = center ? center : null;
        let imageId = image.getDataValue("images")[0].id;
        // check if already exists this label for this same image
        let label: LabelTable | null = await LabelTable.findOne({
          where: {
            image: imageId,
            label: className,
            width: widthReal,
            height: heightReal,
            center: centerReal,
            deleted: false,
          },
        });
        // if a label already exists return error
        if (label) {
          formatResponse(
            res,
            errorFactory.getError(ErrEnum.LabelAlreadyExists).getMessage()
          );
        } else {
          // label creation
          await LabelTable.create({
            image: imageId,
            label: className,
            width: widthReal,
            height: heightReal,
            center: centerReal,
          });
          formatResponse(
            res,
            successFactory
              .getSuccess(SuccessEnum.LabelCreateSuccess)
              .getMessage()
          );
        }
      }
    }
  } catch (error: any) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};

//insert a label on a list of images
export const labelInsertList = async function (
  labelList: any[],
  token: string,
  res: any
) {
  // extract username from token
  let payload = jwt.getPayload(token);
  let username: string = payload.payload.username;
  let finalJSON: any = JSON.parse('{ "response": [] }');
  // search user tokens
  let user: UserTable | null = await UserTable.findOne({
    where: { username: username },
  });
  let userTokens: number = user?.getDataValue("token");
  // error if token are not sufficients
  if (userTokens < 0.05 * labelList.length) {
    formatResponse(res, errorFactory.getError(ErrEnum.AuthError).getMessage());
  } else {
    await UserTable.update(
      {
        token: userTokens - 0.05 * labelList.length,
      },
      { where: { username: username } }
    );
    // iterate over the list of labels
    for (let index: number = 0; index < labelList.length; index++) {
      try {
        let element: any = labelList[index];
        let imagePath: string = element.imagePath;
        let className: any = element.className;
        let height: number = element.height;
        let width: number = element.width;
        let center: number = element.center;

        // create the new element in json
        finalJSON.response.push({ info: [] });
        // check if the user has an image with this path
        let image: DatasetTable | null = await DatasetTable.findOne({
          where: {
            user: username,
            deleted: false,
          },
          include: [
            {
              model: ImageTable,
              required: true,
              where: {
                path: imagePath,
                deleted: false,
              },
            },
          ],
        });
        // if images does not exists
        if (!image) {
          finalJSON.response[index].info.push({
            path: imagePath,
            message: errorFactory
              .getError(ErrEnum.ImageDoesNotExists)
              .getMessage().message,
          });
        } else {
          // if values are undefined, they are set to true
          let widthReal: number | null = width ? width : null;
          let heightReal: number | null = height ? height : null;
          let centerReal: number | null = center ? center : null;
          let imageId = image.getDataValue("images")[0].id;

          // check if already exists this label for this same image
          let label: LabelTable | null = await LabelTable.findOne({
            where: {
              image: imageId,
              label: className,
              width: widthReal,
              height: heightReal,
              center: centerReal,
              deleted: false,
            },
          });
          // if a label already exists return error
          if (label) {
            finalJSON.response[index].info.push({
              path: imagePath,
              message: errorFactory
                .getError(ErrEnum.LabelAlreadyExists)
                .getMessage().message,
            });
          } else {
            // label creation
            await LabelTable.create({
              image: imageId,
              label: className,
              width: widthReal,
              height: heightReal,
              center: centerReal,
            });
            finalJSON.response[index].info.push({
              path: imagePath,
              message: successFactory
                .getSuccess(SuccessEnum.LabelCreateSuccess)
                .getMessage().message,
            });
          }
        }
      } catch (error: any) {
        console.log(error);
        finalJSON.response[index].info.push({
          message: errorFactory.getError(ErrEnum.InternalError).getMessage()
            .message,
        });
      }
    }
    formatResponseWithData(
      res,
      successFactory.getSuccess(SuccessEnum.UpdateSuccess).getMessage(),
      finalJSON.response
    );
  }
};

//update dataset's metadata
export const update = async function (
  datasetName: string,
  newDatasetName: string,
  keywords: string[],
  classes: number,
  token: string,
  res: any
) {
  try {
    // get username from token
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;
    let flag = 1;
    let dataset: DatasetTable | null = await DatasetTable.findOne({
      where: { user: username, name: datasetName },
    });

    if (!dataset) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
      );
    } else {
      let datasetId = dataset.getDataValue("id");

      if (keywords) {
        await KeywordTable.destroy({ where: { dataset: datasetId } });
        keywords.forEach(async (keyword) => {
          await KeywordTable.create({
            keyword: keyword,
            dataset: datasetId,
          });
        });
      }

      if (classes) {
        await DatasetTable.update(
          { classes: classes },
          { where: { id: datasetId, user: username, deleted: false } }
        );
      }
      if (newDatasetName) {
        let newNameAlreadyExists: DatasetTable | null =
          await DatasetTable.findOne({
            where: { name: newDatasetName },
          });
        if (newNameAlreadyExists) {
          flag = 0;
          formatResponse(
            res,
            errorFactory.getError(ErrEnum.DatasetAlreadyExists).getMessage()
          );
        } else {
          await DatasetTable.update(
            { name: newDatasetName },
            { where: { name: datasetName, user: username, deleted: false } }
          );
        }
      }
      if (flag)
        formatResponse(
          res,
          successFactory.getSuccess(SuccessEnum.UpdateSuccess).getMessage()
        );
    }
  } catch (err) {
    formatResponse(
      res,
      errorFactory.getError(ErrEnum.InternalError).getMessage()
    );
  }
};
