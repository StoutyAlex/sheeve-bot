const commands = require('./commands');
const responses = require('./responses');

const { commandPrefix } = require('./config');

const handleResponse = (message) => {
  [ response, ...rest ] = responses.filter(response => response.canHandle(message));

  if (!response || !response.handle ) {
    return;
  }

  return response.handle(message);
};

const handleCommand = (message) => {
  message.content = message.content.substring(commandPrefix.length).trim();
  [ command, ...rest ] = commands.filter(command => command.canHandle(message));
  
  if (!command || !command.handle ) {
    return message.channel.send('Invalid command');
  }

  return command.handle(message);
}

module.exports = { handleCommand, handleResponse };
