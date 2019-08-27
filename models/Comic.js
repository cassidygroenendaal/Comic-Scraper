const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  artist: String,
  hasArtist: {
    type: Boolean,
    required: true,
    default: false
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

const Comic = mongoose.model("Comic", ComicSchema);

module.exports = Comic;
