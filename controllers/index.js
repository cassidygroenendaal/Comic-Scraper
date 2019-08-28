//======================================
// CONFIGS
//--------------------------------------

// NODE PACKAGES
const express = require("express"),
  router = express.Router();

//MODELS
const db = require("../models");

//======================================
// ROUTES
//--------------------------------------

router.get("/", function(req, res) {
  db.Comic.find({}, (err, foundComics) => res.render("index", { comic: foundComics }));
});

router.get("*", (req, res) => res.send("404 PAGE NOT FOUND"));

module.exports = router;
