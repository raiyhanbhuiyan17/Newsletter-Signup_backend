//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("node:https");
const response = require("express");

const app = express();
// app.use(express.static("public")); //this code isn't working
app.use(express.static(__dirname+"/public")); // to use/render static file; to get relative url

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function (req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function (req,res){
   const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    // console.log(firstName, lastName , email);
    const data ={
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }

    };
    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/f08169e509/members";
    const options = {
        method:"POST",
        auth: "Raiyhan:d2ec595bd489ea2b21ab879860a4efa3-us21"
    }
    const request = https.request(url,options,function (response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function (data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure",function (req,res){
    res.redirect("/");
});


//API keys
//d2ec595bd489ea2b21ab879860a4efa3-us21
//listid
//f08169e509

app.listen(process.env.PORT ||3000,function (){
    console.log("Server has been started on port 3000");
});