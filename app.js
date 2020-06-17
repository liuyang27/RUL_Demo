var express=require("express");
var cors = require('cors')
var bodyParser = require('body-parser')
// var fs = require('fs');
var mainCtrl =require("./controllers/mainctrl.js");


var app=express();



app.use(cors())

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



app.get ("/",                                      mainCtrl.showIndex);
app.get ("/getdata",                               mainCtrl.getData);
app.all ("/addnewdata",                            mainCtrl.addData);
app.get ("/resetdata",                             mainCtrl.resetData);
app.all("/sensordata",                             mainCtrl.sensorData);
app.get("/getsensordata",                          mainCtrl.getSensorData);



app.use(express.static("public"));


app.use(function(req,res){
    res.send("404 page not found..");
});


app.listen(3000,()=>{
    console.log('HTTP Server is running on: http://localhost:3000');
});


