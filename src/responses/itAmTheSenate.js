
module.exports = {
  canHandle: (message) => {
    return message.content.toLowerCase().includes('the senate');
  },
  handle: (message) => {
    message.reply('I AM THE SENATE!');
  }
};