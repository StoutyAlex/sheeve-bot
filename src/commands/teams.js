
module.exports = {
  canHandle: (message) => {
    return message.content == 'hello';
  },
  handle: (message) => {
    console.log(message.channel);
    message.channel.send('Hello there');
  }
};