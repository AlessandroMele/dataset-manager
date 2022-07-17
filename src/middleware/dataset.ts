import {ErrEnum, Response} from "../responseFactory/util";
import {ErrorFactory} from "../responseFactory/Error";

const util = require("util");

const errorFactory: ErrorFactory = new ErrorFactory();
/**
 * Check if the input body contains valid dataset
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkDatasetName = function (req: any, res: any, next: any) {
  try {
    //checking if dataset is valid
    if (typeof req.body.datasetName !== 'string') {
      var error = errorFactory.getError(ErrEnum.NoInputDatasetError).getMessage();
      next(error)
    }
    else next()
  }
  catch (error: any) {
    var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
    next(error)
  };
}


/**
 * Check if the input body contains class name
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkClassName = function (req: any, res: any, next: any) {
  try {
    //checking if className is valid
    if (typeof req.body.className !== 'string') {
      var error = errorFactory.getError(ErrEnum.NoInputClassNameError).getMessage();
      next(error)
    }
    else next()
  }
  catch (error: any) {
    var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
    next(error)
  };
}


/**
 * Check if the input list contains class names
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkClassNameList = function (req: any, res: any, next: any) {
  try {
    if (req.body.labelList.length !== 0) {
      req.body.labelList.forEach((element: any) => {
        //checking if className is valid
        if (typeof element.className !== 'string') {
          var error = errorFactory.getError(ErrEnum.NoInputClassNameError).getMessage();
          next(error)
        }
        else next()
      });
    } else {
      var error = errorFactory.getError(ErrEnum.NoInputClassNameError).getMessage();
      next(error)
    }
  }
  catch (err: any) {
    var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
    next(error)
  };
}


/**
 * Check if the input body contains identifier
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkImageIdentifier = function (req: any, res: any, next: any) {
  try {
    //checking if className is valid
    if (typeof req.body.imagePath !== 'string') {
      var error = errorFactory.getError(ErrEnum.NoInputImageIdentifierError).getMessage();
      next(error)
    }
    else next()
  }
  catch (error: any) {
    var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
    next(error)
  };
}



/**
 * Check if the input body contains a list 
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkLabelList = function (req: any, res: any, next: any) {
  try {
    //checking if className is valid
    if (!util.isArray(req.body.labelList)) {
      var error = errorFactory.getError(ErrEnum.NoInputLabelListError).getMessage();
      next(error)
    }
    else next()
  }
  catch (error: any) {
    var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
    next(error)
  };
}


/**
 * Check if the input list contains identifier for each image
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkImageIdentifierList = function (req: any, res: any, next: any) {
  try {
    if (req.body.labelList.length !== 0) {
      req.body.labelList.forEach((element: any) => {
        if (typeof element.imagePath !== 'string') {
          var error = errorFactory.getError(ErrEnum.NoInputImageIdentifierError).getMessage();
          next(error)
        }
        else next()
      })
    }
    else {
      var error = errorFactory.getError(ErrEnum.NoInputImageIdentifierError).getMessage();
      next(error)
    }
  }
  catch (error: any) {
    var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
    next(error)
  };
}

/**
 * Returns error if the input body contains invalid bounding boxes
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkBoundingBoxesName = function (req: any, res: any, next: any) {
  try {
    // no error if neither the 3 params aren't specified, if they are specified must be normalized
    if ((req.body.height < 1.0 && req.body.height > 0.0 &&
      req.body.width < 1.0 && req.body.width > 0.0 &&
      req.body.center < 1.0 && req.body.center > 0.0) ||
      (!req.body.height && !req.body.width && !req.body.center)) next()
    else {
      var error = errorFactory.getError(ErrEnum.NoInputValidBoundingBoxesError).getMessage();
      next(error)
    }
  }
  catch (error: any) {
    var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
    next(error)
  };
}

/**
 * Returns error if the list of labels contains invalid bounding boxes
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkBoundingBoxesNameList = function (req: any, res: any, next: any) {
  try {
    if (req.body.labelList.length !== 0) {
      req.body.labelList.forEach((element: any) => {
        // no error if neither the 3 params aren't specified, if they are specified must be normalized
        if ((element.height < 1.0 && element.height > 0.0 &&
          element.width < 1.0 && element.width > 0.0 &&
          element.center < 1.0 && element.center > 0.0) ||
          (!element.height && !element.width && !element.center)) next()
        else {
          var error = errorFactory.getError(ErrEnum.NoInputValidBoundingBoxesError).getMessage();
          next(error)
        }
      });
    }
    else {
      var error = errorFactory.getError(ErrEnum.NoInputValidBoundingBoxesError).getMessage();
      next(error)
    }
  }
  catch (error: any) {
    var error: Response = errorFactory.getError(ErrEnum.InternalError).getMessage();
    next(error)
  };
}

/**
 * Check if the input body contains valid number classes of dataset
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkClasses = function (req: any, res: any, next: any) {
  try {
    //checking if model_name is valid
    if (typeof req.body.classes !== 'number') {
      var error = errorFactory.getError(ErrEnum.NoInputClassesError).getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};

/**
 * Check if the input body contains valid keywords
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checKeywords = function (req: any, res: any, next: any) {
  try {
    //checking if keywords are in the body request
    if (!util.isArray(req.body.keywords)) {
      var error = errorFactory.getError(ErrEnum.NoInputKeywordsError).getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};

/**
 * Check if the input forma contains an image
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkImageFile = function (req: any, res: any, next: any) {
  try {
    const array: string[] = req.files.fileName.mimetype.split('/');
    const type: string = array[0];
    //checking if file is image
    if (type !== 'image') {
      var error = errorFactory.getError(ErrEnum.NoInputImageError).getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }


};
/**
 * Check if the input body contains valid number classes of dataset
 * @param req user request
 * @param res response
 * @param next next middleware
 */
export const checkZip = function (req: any, res: any, next: any) {
  try {
    const array: string[] = req.files.fileName.mimetype.split('/');
    const hopeIsZip: string = array[1];
    if (hopeIsZip !== 'zip') {
      var error = errorFactory.getError(ErrEnum.NoInputZipError).getMessage();
      next(error);
    } else next();
  } catch (error: any) {
    var error: Response = errorFactory
      .getError(ErrEnum.InternalError)
      .getMessage();
    next(error);
  }
};