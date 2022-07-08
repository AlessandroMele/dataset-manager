var jwt = require("../middleware/jwt");

//generate and return the token with informations given in the body
export const login = function(req: any,res: any){
    try {
        //checking if body contains fields
        if (req.body.username && req.body.role) {
          var username: string = req.body.username;
          var role: string = req.body.role;
          
          //generating token
          let token: string = jwt.setToken(username, role)
          
          let decoded: string = jwt.getPayload(token)
          res.json(
            {
              token: token,
              info: decoded
            });
        }
        else {
          throw new Error("Need to specify username and role in the body");
        }
      } catch (error:any) {
        res.status(500);
        res.send(error.message);
      }
};

//return user's residual tokens
export const residualToken = function(req: any, res: any){
};

//update user's token
export const updateToken = function(req: any, res: any){
};