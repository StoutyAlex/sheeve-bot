const ytdl = require('ytdl-core');
const queue = require('../queue');

const command = 'skip';

module.exports = {
  id: 'command_skip',
  displayName: 'skip',
  canHandle: (message) => {
    return message.content.toLowerCase().startsWith(command);
  },
  handle: async (message, _, serverQueue) => {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }
};
