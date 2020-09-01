const state = require('../../serverState');
const queue = require('../../queue');
const YouTube = require('discord-youtube-api');
const ytdl = require('ytdl-core');

const { add, remove, _delete, create, list, listSongs } = require('./controller');
const Playlist = require('../../database/models/Playlist');

const youtube = new YouTube(process.env.YOUTUBE_API);

const command = 'playlist';

const getSongFromYoutube = async (song) => {
  const video = await youtube.searchVideos(song.toString().replace(/,/g,' ')).catch(err => console.log(err));
  return video.url;
};

const play = (guild, song, serverQueue) => {
  // console.log('PLAY, 2', serverQueue);
  if (!song) {
    // serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0], serverQueue);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  // serverQueue.textChannel.send(`Start playing: **${song}**`);
}

module.exports = {
  id: 'command_playlist',
  displayName: 'playlist',
  canHandle: (message) => {
    return message.content.toLowerCase().startsWith(command);
  },
  handle: async (message) => {
    const serverState = state.get(message.guild.id);
    const serverQueue = queue.get(message.guild.id);

    const [ action, name, song ] = message.content.substring(command.length).trim().split(' ');
    if (!action) return message.channel.send('usage: "sheev add/remove <playlist-name> <song-url/phrase>"');

    if (action === 'list') {
      const playlists = await list(message.guild.id);
      return message.channel.send(`Your playlists are:\n ${playlists}`);
    }

    if (action === 'songs') {
      const songPlayists = await listSongs({ name: name, guild: message.guild.id });
      if (!songPlayists || !songPlayists.length === 0) return message.channel.send(`Could not find playlist ${nane} or there are no songs`); 
      return message.channel.send(`Songs in  are:\n ${songPlayists}`);
    }

    if (action === 'delete') {
      if (!name) return message.channel.send('usage: "sheev delete <playlist-name>"');
      await _delete({ name: name, guild: message.guild.id });
    }

    if (action === 'play') {
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) return message.channel.send('Try again while in a voice channel');
      if (!name) return message.channel.send('usage: "sheev play <playlist-name>"');
      // queue list of songs here
      // support shuffle and stuff
      const songsInPlaylist = await listSongs({ name: name, guild: message.guild.id });
      serverQueue.songs = songsInPlaylist;

      console.log('HERE');
      console.log(songsInPlaylist, serverQueue.songs);

      if (!serverQueue.connection || !serverQueue.voiceChannel) {  
        try {
          const connection = await voiceChannel.join();
          serverQueue.connection = connection;
          play(message.guild, serverQueue.songs[0], serverQueue);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        // play(message.guild, serverQueue.songs[0]);
        return message.channel.send(`That has been added to the queue!`);
      }
      return message.channel.send(`Playlist ${name} has started playing...`);
    }

    const video = !song.includes('youtube.com') ? await getSongFromYoutube(song) : song;

    const results = await Playlist.findOne({ guild: message.guild.id, name: name.toLowerCase() }).exec();
    let playlist = results || await create({ name, guild: message.guild.id, songs: [video] });

    switch(action.toLowerCase()) {
      case 'add':
        if (!song || !name) return message.channel.send('usage: "sheev add <playlist-name> <song-url/phrase>"');
        playlist = await add(playlist, video);
        break;
      case 'remove': 
        if (!song || !name) return message.channel.send('usage: "sheev remove <playlist-name> <song-url/phrase>"');
        playlist = await remove(playlist, video);
        break;
    }

    return message.channel.send(`${playlist} - ${results}`);
  }
};
