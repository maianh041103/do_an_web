const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require("socket.io");

require('dotenv').config();

const app = express();

//socket.io
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
//End socket.io

//Nhúng cors
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
}
app.use(cors());
//End nhúng cors

//Nhúng pug
app.set("views", './api/v1/views');
app.set('view engine', 'pug');
//End nhúng pug

//Nhúng file tĩnh
app.use(express.static(`${__dirname}/public`));
//End nhúng file tĩnh

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
const routeChat = require('./api/v1/router/chat/index.route');
routeClient(app);
routeAdmin(app);
routeChat(app);
//End nhúng route


const port = process.env.PORT;

server.listen(port, () => {
  console.log("App listen on port : " + port);
})