//======================================
// CONFIGS
//--------------------------------------

// NODE PACKAGES
const express = require("express"),
  router = express.Router(),
  axios = require("axios"),
  cheerio = require("cheerio");

//MODELS
const db = require("../models");

//======================================
// ROUTES
//--------------------------------------

// SCRAPE ROUTE
router.get("/scrape", (req, res) => {
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

// GET ALL COMICS
router.get("/comics", (req, res) => {
  db.Comic
    .find({})
    .then((foundComics) => res.json(foundComics))
    .catch((err) => res.json(err));
});

// DELETE ALL COMICS
router.delete("/comics", (req, res) => {
  db.Comic.deleteMany({}).then(() => res.end()).catch((err) => console.log(err));
});
// DELETE ALL COMICS
router.delete("/notes/:id", (req, res) => {
  db.Note.deleteOne({_id: req.params.id}).then(() => res.end()).catch((err) => console.log(err));
});

// GET ONE COMIC
router.get("/comics/:id", (req, res) => {
  db.Comic
    .findOne({ _id: req.params.id })
    .populate("note")
    .then((foundComic) => res.json(foundComic))
    .catch((err) => res.json(err));
});

//CREATE ONE COMIC
router.post("/comics/:id", (req, res) => {
  db.Note
    .create(req.body)
    .then((newNote) =>
      db.Comic.findOneAndUpdate(
        { _id: req.params.id },
        { note: newNote._id },
        { new: true }
      )
    )
    .then((updatedComic) => res.json(updatedComic))
    .catch((err) => res.json(err));
});

module.exports = router;
