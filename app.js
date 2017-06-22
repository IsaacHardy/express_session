const express = require("express");
const parseurl = require("parse_url");
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
  resave: true,
  saveUninitialized: true
}));

app.get("/", function(req, res) {
  if (req.session.email) {
    res.redirect("/user");
  } else {
    res.render("index");
  }
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  req.session.email = req.body.email;

  res.redirect("/user");

});

app.get("/user", function(req, res) {
  if (req.session.email) {
    if (req.session.viewCount >= 1) {
      req.session.viewCount++;
    } else {
      req.session.viewCount = 1;
    }
    res.render("user", {email: req.session.email, viewCount: req.session.viewCount});
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
