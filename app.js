require('dotenv').config();
const express = require('express');
const app = express();
const chalk = require('chalk');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const mongoose = require('mongoose');

//import api routes
const api = require('./src/routes/api');

//setup mongoose and mongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
});

mongoose.connection.on('connected', () => {
    console.log('Succesful');
});

//middlewares
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//json format
app.set('json spaces', 2)

//test
app.get('/', (req, res) => {
    res.send('Hello there');
})

//CORS
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Authorization");
  
    next();
  });
  
  app.options("*", (request, response, next) => {
    response.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE"
    );
    response.send(200);
  
    next();
  })

//API Route
app.use('/api/v1', api);

//error 404
app.use((request, response) => {
    const ERROR = {
      message: '404. Not Found'
    }
    response
      .status(404)
      .json(ERROR);
  });

  //error 500
  app.use((err, request, response, next) => {
    const ERROR = {
      message: '500. Server Error'
    }
    response
      .status(500)
      .json(ERROR);
  });
  

//server listening
app.listen(PORT, () => {
    const msg = chalk.yellow(`Server is listening on PORT: ${PORT}`);

    console.log(msg);
})