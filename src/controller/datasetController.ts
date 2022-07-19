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
const AdmZip = require("adm-zip");

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();

/**
 * creating new dataset
 * @param datasetName name of the dataset
 * @param classes number of the classes
 * @param keywords array of keyword
 * @param token of the user
 * @param res response
 */
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
    let userDataset: DatasetTable | null = await DatasetTable.findOne({
      where: { user: username, name: datasetName, deleted: false },
    });
    // if a dataset already exists, error
    if (userDataset != null) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.DatasetAlreadyExists).getMessage()
      );
    } else {
      //inserting dataset on db
      const dataset = await DatasetTable.create({
        name: datasetName,
        classes: classes,
        user: username,
      });
      //inserting keywords (is array)
      keywords.forEach(async (kw) => {
        await KeywordTable.create({
          keyword: kw,
          dataset: dataset.getDataValue("id"),
        });
      });
      //success
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

/**
 * delete dataset
 * @param datasetName name of the dataset
 * @param token of the user
 * @param res response
 */
export const remove = async function (
  datasetName: string,
  token: string,
  res: any
) {
  try {
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;

    // extract dataset
    let userDataset: DatasetTable | null = await DatasetTable.findOne({
      where: { user: username, name: datasetName, deleted: false },
    });
    // if dataset does not exists, error
    if (!userDataset) {
      formatResponse(
        res,
        errorFactory.getError(ErrEnum.NoDatasetFoundError).getMessage()
      );
    } else {
      //getting id of dataset
      let datasetId: number = userDataset.getDataValue("id");
      // deleting (logical) dataset
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
      //success
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

/**
 * getting list of datasets
 * @param token of the user
 * @param res response
 */
export const list = async function (token: string, res: any) {
  try {
    // get username from token
    let payload = jwt.getPayload(token);
    let username: string = payload.payload.username;
    //join between dataset model, images, labels and keywords for full infos
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
      //success
      formatResponseWithData(
        res,
        successFactory.getSuccess(SuccessEnum.GetSuccess).getMessage(),
        { datasetList: datasetList }
      );
    } else {
      //no dataset found
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

/**
 * inserting new image on the dataset
 * @param req request
 * @param token of the user
 * @param res response
 */
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

        // creating directories for saving image
        let savePath = path.join(
          __dirname,
          "..",
          "..",
          "datasets",
          username,
          datasetName,
          datasetId.toString() // needed to avoid collisions when dataset is deleted and recreated
        );

        // create the path to store image in the database
        const finalPath: string = path.join(
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
            path: finalPath,
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
            path: finalPath,
          });
          await DatasetTable.update(
            {
              path: finalPath,
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
            successFactory
              .getSuccess(SuccessEnum.ImageInsertSuccess)
              .getMessage(),
            {
              data: {
                path: finalPath,
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

/**
 * insert a label on a specific image
 * @param imagePath path of the image
 * @param className number of the classes
 * @param keywords array of keyword
 * @param token of the user
 * @param res response
 */
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
      let datasetId: number = dataset.getDataValue("id");
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

      //saving zip on tmp folder server
      const zipPath: string = path.join(savePath, file.name);
      await file.mv(zipPath);

      //unzipping and loading all files in the dataset folder
      const zip = new AdmZip(zipPath);
      let zipEntries = zip.getEntries(); // an array of ZipEntry records

      let finalJSON: any = JSON.parse('{ "response": [] }');
      for (let index = 0; index < zipEntries.length; index++) {
        let element: any = zipEntries[index];
        console.log(element.entryName);

        const filePath: string = path.join(
          "datasets",
          username,
          datasetName,
          datasetId.toString(),
          element.entryName
        );
        finalJSON.response.push({ info: [] });

        ////// AGGIUNGERE CONTROLLO TOKEN E LUNGHEZZA DEL FILEPATH /////////
        let user: UserTable | null = await UserTable.findOne({
          where: { username: username },
        });
        let userTokens: number = user?.getDataValue("token");
        // error if token are not sufficients
        if (userTokens < 0.1) {
          finalJSON.response[index].info.push({
            path: filePath,
            message: errorFactory.getError(ErrEnum.AuthError).getMessage()
              .message,
          });
        } else {
          await UserTable.update(
            {
              token: userTokens - 0.1,
            },
            { where: { username: username } }
          );

          if (
            (element.entryName.includes(".jpg") ||
              element.entryName.includes(".jpeg") ||
              element.entryName.includes(".png")) &&
            !element.entryName.includes("/") &&
            filePath.length < 100
          ) {
            // check if the image already exists
            let image: ImageTable | null = await ImageTable.findOne({
              where: {
                dataset: datasetId,
                path: filePath,
                deleted: false,
              },
            });
            // if it exists return error
            if (image) {
              finalJSON.response[index].info.push({
                path: filePath,
                message: errorFactory
                  .getError(ErrEnum.ImageAlreadyExists)
                  .getMessage().message,
              });
              console.log(finalJSON.response[0].info);
            } else {
              await ImageTable.create({
                dataset: datasetId,
                path: filePath,
              });
              zip.extractEntryTo(
                /*entry name*/ element,
                /*target path*/ savePath,
                /*maintainEntryPath*/ false,
                /*overwrite*/ true
              );
              finalJSON.response[index].info.push({
                path: filePath,
                message: successFactory
                  .getSuccess(SuccessEnum.ImageInsertSuccess)
                  .getMessage().message,
              });
            }
          } else {
            finalJSON.response[index].info.push({
              path: filePath,
              message: errorFactory
                .getError(ErrEnum.NoImageFoundError)
                .getMessage().message,
            });
          }
        }
      }
      //deleting zip file
      await fs.unlinkSync(zipPath);
      formatResponseWithData(
        res,
        successFactory.getSuccess(SuccessEnum.UpdateSuccess).getMessage(),
        finalJSON.response
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
