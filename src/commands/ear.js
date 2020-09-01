const state = require('../serverState');

const command = 'earrape';

module.exports = {
  id: 'command_ear',
  displayName: 'ear',
  canHandle: (message) => {
    return message.content.toLowerCase().startsWith(command);
  },
  handle: async (message) => {
    const serverState = state.get(message.guild.id);
    serverState.ear = !serverState.ear;

    if (serverState.ear) {
      return message.channel.send("Ear rape has been enabled - enjoy your shit music");
    }
    return message.channel.send("Ear rape has been disabled - thank god");
  }
};
