const commands = require('./commands');
const responses = require('./responses');

const { commandPrefix, maxHistory } = require('./config');

const previousCommands = [];
const previousResponses = [];

const logResult = (array, id) => {
  if (array.length >= maxHistory) {
    array.shift();
  }
  array.push(id);
}

const handleResponse = (message) => {
  [ response, ...rest ] = responses.filter(response => response.canHandle(message, previousResponses));

  if (!response || !response.handle ) {
    return;
  }

  logResult(previousResponses, response.id);
  return response.handle(message, previousResponses);
};

const handleCommand = (message) => {
  message.content = message.content.substring(commandPrefix.length).trim();
  [ command, ...rest ] = commands.filter(command => command.canHandle(message, previousCommands));
  
  if (!command || !command.handle ) {
    return message.channel.send('Invalid command');
  }

  logResult(previousCommands, command.id);
  return command.handle(message, previousCommands);
}

module.exports = { handleCommand, handleResponse };
