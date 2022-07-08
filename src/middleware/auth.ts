const jwt = require("./jwt");
/**
 * Check if the header contains a valid token
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkAutorization = (req:any, res:any, next:any) => {
    try {
        //check if authorization field is empty
        if (req.headers["authorization"] == null)
            //unauthorized
            res.sendStatus(401);
        else {
            //extracting token
            let token = req.headers["authorization"];
            
            //token variable starts with "Bearer ", so now we cut that word
            token = token.slice(7, token.length);

            //checking token
            if(jwt.verifyToken(token) === true) {
                //go next middleware
                next();
            }
            else
                res.send(jwt.verifyToken(token));
        }
    }
    catch(error:any) {
        console.error(error.message)
        //unauthorized
        res.sendStatus(401)
    };
}



