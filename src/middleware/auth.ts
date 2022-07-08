const jwt = require("./jwt");

/**
 * Check if the header contains the token and if it's valid 
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkAutorization = (req:any, res:any, next:any) => {
    try {
        if (req.headers["authorization"] == null) res.sendStatus(401);
        else {
            let token = req.headers["authorization"];
            token = token.slice(7, token.length)
            console.log(token)
            if(jwt.verifyToken(token) === true) {
                next();
            }
            else res.send("erroreeeeeeeeee: " +  jwt.verifyToken(token))
        }
    }
    catch(error:any) {
        console.log("Errore" + error.message)
        res.sendStatus(401)
    }
}



