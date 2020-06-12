var express=require("express");
var cors = require('cors')
// var bodyParser = require('body-parser')
// var fs = require('fs');
var mainCtrl =require("./controllers/mainctrl.js");


var app=express();



app.use(cors())

app.set("view engine","ejs");

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())



app.get ("/",                                      mainCtrl.showIndex);
app.get ("/getdata",                               mainCtrl.getData);
app.get ("/addnewdata",                               mainCtrl.AddData);
app.get ("/resetdata",                               mainCtrl.ResetData);
// app.post("/svr/model",                                      mainCtrl.doAddModel)
// app.put("/svr/model/:mid",                                  mainCtrl.doEditModel)
// app.delete("/svr/model/:mid",                               mainCtrl.doDeleteModel)
// app.get("/svr/model/:mid",                                  mainCtrl.getModelDetail)
// app.get("/svr/model/edit/:mid",                             mainCtrl.getEditModelDetail)


app.use(express.static("public"));


app.use(function(req,res){
    res.send("404 page not found..");
});


app.listen(3000,()=>{
    console.log('HTTP Server is running on: http://localhost:3000');
});


