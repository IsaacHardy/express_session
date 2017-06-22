const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const mustacheExpress = require("mustache-express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());

app.use(session({
  secret: 'asdfsdafasafsdf',
  resave: false, // What does this do?
  saveUninitialized: true // What does this do?
}));

let messages = [];

let users = [{username: "isaachardy", password: "password"}];

app.get("/", function(req, res) {
  if (req.session.username) {
    res.redirect("/user");
  } else {
    res.render("index");
  }
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  let loggedUser;
  messages = [];

  users.forEach(function(user) {
    if (user.username === req.body.username) {
      loggedUser = user;
    }
  });

  req.checkBody("username", "Please Enter a valid username.").notEmpty().isLength({min: 8, max: 20});
  req.checkBody("password", "Please Enter a Password.").notEmpty();
  req.checkBody("password", "Invalid password and username combination.").equals(loggedUser.password);

  let errors = req.validationErrors();

  if (errors) {
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    res.render("login", {errors: messages});
  } else {
    req.session.cookie.secure = true;
    req.session.username = req.body.username;

    res.redirect("/user");
  }
});

app.get("/user", function(req, res) {
  if (req.session.username) {
    if (req.session.viewCount && req.session.viewCount >= 1) {
      req.session.viewCount++;
    } else {
      req.session.viewCount = 1;
    }
    res.render("user", {username: req.session.username, viewCount: req.session.viewCount});
  } else {
    res.redirect("/");
  }
});

app.get('/logout',function(req,res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.listen(3000, function() {
  console.log("App running on localhost:3000");
});
