
module.exports = {
  canHandle: (message) => {
    return message.content.toLowerCase().includes('do it');
  },
  handle: (message) => {
    message.channel.send('DO IT');
  }
};
