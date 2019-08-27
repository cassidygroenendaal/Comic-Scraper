//======================================
// CONFIGS
//--------------------------------------

// NODE PACKAGES
const express = require("express"),
  exphbs = require("express-handlebars"),
  mongoose = require("mongoose"),
  logger = require("morgan"),
  axios = require("axios"),
  cheerio = require("cheerio");

const app = express(),
  PORT = process.env.PORT || 8080;

//MODELS
const db = require("./models");

//DEV TOOLS
app.use(logger("dev"));

//APP SET UP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//DATABASE CONNECTION
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper_db";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//======================================
// ROUTES
//--------------------------------------

app.get("/", function(req, res) {
  db.Comic.find({}, (err, foundComics) => res.render("index", { comic: foundComics }));
});

app.get("/api/scrape", (req, res) => {
  axios
    .get("https://www.hiveworkscomics.com/")
    .then((response) => {
      const $ = cheerio.load(response.data);
      $("div.comicblock").each((i, el) => {
        let newComic = {};
        let author = "",
          artist = "";
        let title = $(el).find("div.comicrollover").find("a.comiclink").find("h1").text(),
          creator = $(el).find("div.comicrollover").find("a.comiclink").find("h2").text(),
          image = $(el).find("a.comicimage").find("img").attr("src"),
          link = $(el).find("div.comicrollover").find("a.comiclink").attr("href");
        if (creator !== undefined) {
          author = creator.split("by ")[1];
          if (author !== undefined && author.includes("\nDrawn")) {
            author = author.split("\nDrawn ")[0];
          }
          if (creator.includes("\nDrawn")) {
            newComic.hasArtist = true;
            artist = creator.split("\nDrawn by ")[1];
            newComic.artist = artist || "Not Available";
          }
        }
        newComic.title = title || "Not Available";
        newComic.author = author || "Not Available";
        newComic.image = image || "Not Available";
        newComic.link = link || "Not Available";
        db.Comic.create(newComic).then().catch((err) => {});
      });
      res.status(200).end();
    })
    .catch((err) => console.log(err));
});

app.get("/api/comics", (req, res) => {
  console.log("This is the ARTICLES route");
});

app.delete("/api/comics", (req, res) => {
  db.Comic.deleteMany({}).then(() => res.end()).catch((err) => console.log(err));
});

app.get("/api/comics/:id", (req, res) => {
  console.log(`This is the GET ARTICLES route id #${req.params.id}`);
});

app.post("/api/comics/:id", (req, res) => {
  console.log(`This is the POST ARTICLES route id #${req.params.id}`);
});

app.get("*", (req, res) => res.send("404 PAGE NOT FOUND"));

//======================================
// SERVER START
//--------------------------------------

app.listen(PORT, () => console.log(`==> Server running on ${PORT}`));
