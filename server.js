//mongoDB connection string
//mongodb+srv://raj:<password>@nodejsdemomongocluster-qkwh8.azure.mongodb.net/test?retryWrites=true&w=majority


var express = require('express');
var app = express();
var port = process.env.port || 8008;

var bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

// create application/json parser
app.use(bodyParser.json());

 
var userController=require('./controller/usercontroller')();

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/AbcBank', { useNewUrlParser: true, useUnifiedTopology: true });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('Connected to MongoDB!');
// });

app.use("/",userController);
//app.use("/api/adduser",userController);
//app.use("/api/updateuser/:Name",userController);

// app.get("/",function(request,response)
// {
//     response.json({"Message":"Welcome to Node js"});
// });
 
app.listen(port, function () {
    var datetime = new Date();
    var message = "Server runnning on Port:- " + port + " Started at :- " + datetime;
    console.log(message);
});