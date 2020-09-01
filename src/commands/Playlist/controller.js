const Playlist = require('../../database/models/Playlist');

const add = async (playlist, song) => {
  const doc = await Playlist.findOne({ name: playlist.name, guild: playlist.guild }).exec();
  doc.songs.push(song);
  await doc.save();
  return doc;
};

const remove = async (playlist, song) => {
  const newSongList = playlist.songs.filter(el => song !== el);
  const doc = await Playlist.findOne({ name: playlist.name, guild: playlist.guild }).exec();
  doc.songs = newSongList;
  await doc.save();
  return doc;
}

const _delete = async (playlist) => {
  await Playlist.deleteOne(playlist);
};

const list = async (guild) => {
  const docs = await Playlist.find({ guild: guild }).exec();
  return docs.map(playlist => playlist.name);
}

const listSongs = async (playlist) => {
  const doc = await Playlist.findOne(playlist).exec();
  if (!doc || !doc.songs) return null;
  return doc.songs;
};

const create = async ({ name, guild, songs }) => {
  const doc = await new Playlist({
    name,
    guild,
    songs
  }).save();

  return doc;
};

module.exports =  { add, remove, _delete, create, list, listSongs };
