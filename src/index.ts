import { Identifier } from 'sequelize/types';
import { UserTable, ModelTable, DatasetTable, ImageTable } from './model/Tables';
import { checkAutorization } from './middleware/auth';
const userRouter = require('./routes/user');
const express = require('express');


const app = express();
app.use(express.json());

app.use('/user', userRouter);



app.get('/',[checkAutorization], function(req:any, res:any) {
  res.send('Ciao ciao homepage');
});



app.get('/utente/:id',[checkAutorization], async function(req:any, res:any, next:any) {
  let result: any;
  let id:Identifier = req.params.id;
    try{
        result = await UserTable.findByPk(id, {raw: true});
    }catch(error){
      res.send(error);
    }
    res.send(result);
});





/** 
 * check if the env variable APP_PORT is set and activate the application 
 */

 if(process.env.APP_PORT) {
  var port:string = process.env.APP_PORT;
  } else {
  throw new Error("APP_PORT environment variable is not set")
}

app.listen(Number(port), () => {
  console.log(`Ready for accepting requests on port ${port}`);
});
