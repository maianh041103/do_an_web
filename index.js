const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

//Nhúng cors
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
}
app.use(cors());
//End nhúng cors

//Nhúng body-parser
app.use(bodyParser.json())
//End nhúng body-parser

//Connect database
const database = require('./config/database');
database.connect();
//End connect database

//Nhúng route 
const routeClient = require('./api/v1/router/client/index.route');
const routeAdmin = require('./api/v1/router/admin/index.route');
routeClient(app);
routeAdmin(app);
//End nhúng route


const port = process.env.PORT;

app.listen(port, () => {
  console.log("App listen on port : " + port);
})