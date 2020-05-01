
module.exports = {
  canHandle: (message) => {
    return message.content.toLowerCase().includes('betrayal');
  },
  handle: (message) => {
    message.channel.send("It's treason then");
  }
};
