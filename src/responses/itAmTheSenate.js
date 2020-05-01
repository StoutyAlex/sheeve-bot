
module.exports = {
  canHandle: (message) => {
    return message.content.toLowerCase().includes('the senate');
  },
  handle: (message) => {
    message.channel.send('I AM THE SENATE!');
  }
};
