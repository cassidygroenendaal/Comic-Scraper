//======================================
// CONFIGS
//--------------------------------------

const express = require("express"),
  exphbs = require("express-handlebars"),
  mongoose = require("mongoose"),
  logger = require("morgan"),
  axios = require("axios"),
  cheerio = require("cheerio");

const app = express(),
  PORT = process.env.PORT || 8080;

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/scraper_db", { useNewUrlParser: true });

//======================================
// ROUTES
//--------------------------------------

app.get("/", function(req, res) {
  res.render("index");
});

//======================================
// SERVER START
//--------------------------------------

app.listen(PORT, () => console.log(`==> Server running on ${PORT}`));
