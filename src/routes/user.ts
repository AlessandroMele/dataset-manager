const express = require('express');
const jwt = require("../middleware/jwt");
const router = express.Router();


/**
 * generate and return the token with informations give in the body
 */
router.post('/login', function (req: any, res: any) {
  try {

    console.log(req.body.username, req.body.role)
    if (req.body.username && req.body.role) {
      var username: string = req.body.username;
      var role: string = req.body.role;
      let token: string = jwt.setToken(username, role)
      let decoded: string = jwt.getPayload(token)
      res.json(
        {
          token: token,
          payload: decoded
        });
    }
    else {
      throw new Error("Need to specify username and role in the body")
    }
  } catch (error:any) {
    res.status(500)
    res.send(error.message)
  }
});



module.exports = router;
