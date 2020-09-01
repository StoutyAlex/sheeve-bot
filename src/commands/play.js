const ytdl = require('ytdl-core');
const YouTube = require('discord-youtube-api');
const queue = require('../queue');
const state = require('../serverState');

const youtube = new YouTube(process.env.YOUTUBE_API);

const command = 'play';

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    // serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  // serverQueue.textChannel.send(`Start playing: **${song}**`);
}

const EAR_WORDS = ['earrape', 'earape', 'ear rape', 'ear-rape', 'ear_rape', 'earrapee'];

module.exports = {
  id: 'command_play',
  displayName: 'play',
  canHandle: (message) => {
    return message.content.toLowerCase().startsWith(command);
  },
  handle: async (message) => {
    let phrase = message.content.substring(command.length).trim();
    const voiceChannel = message.member.voice.channel;
    const serverQueue = queue.get(message.guild.id);
    const serverState = state.get(message.guild.id);

    if (!voiceChannel) return message.channel.send('Try again while in a voice channel');

    if (!phrase.includes('youtube.com')) {
      const video = await youtube.searchVideos(phrase.toString().replace(/,/g,' ')).catch(err => console.log(err));
      phrase = video.url;
      message.channel.send(`Playing: ${phrase}`);
    }

    if (!serverState.ear) {
      const videoInfo = await ytdl.getBasicInfo(phrase);
      const title = videoInfo.title.toLowerCase();
      const banned = EAR_WORDS.some(el => title.includes(el));
      if (banned) return message.channel.send('This song is banned due to ear rape');
    };

    if (!serverQueue.connection || !serverQueue.voiceChannel) {
      serverQueue.songs.push(phrase);

      try {
        const connection = await voiceChannel.join();
        serverQueue.connection = connection;
        play(message.guild, serverQueue.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(phrase);
      return message.channel.send(`That has been added to the queue!`);
    }

    // voiceChannel.join().then(connection => {
    //   connection.play(ytdl(phrase)).on('finish', () => {
    //     console.log('Finished');
    //   });
    // }).catch(err => console.log(err))
  }
};