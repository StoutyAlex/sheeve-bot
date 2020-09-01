const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Playlist = new Schema({
  guild: String,
  name: String,
  songs: Array,
});

module.exports = mongoose.model('Playlist', Playlist);
