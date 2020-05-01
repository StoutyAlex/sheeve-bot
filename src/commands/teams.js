
module.exports = {
  canHandle: (message) => {
    return message.content == 'hello';
  },
  handle: (message) => {
    message.reply('Hello there');
  }
};