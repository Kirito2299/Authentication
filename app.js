require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password']});

const User = new mongoose.model("User", userSchema);

app.route("/")
.get(function(req,res){
  res.render("home.ejs");
});

app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.route("/login")
.get(function(req,res){
  res.render("login.ejs");
})
.post(function(req,res){
  User.findOne({email: req.body.username},function(err,found){
    if(err){
      console.log(err);
    }else{
      if(found){
        if(found.password === req.body.password){
          console.log("Success");
          res.render("secrets");
        }
      }
    }
  });
});

app.route("/submit")
.get(function(req,res){
  res.render("submit");
})
.post(function(req,res){
  res.render("submit");
});

//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
