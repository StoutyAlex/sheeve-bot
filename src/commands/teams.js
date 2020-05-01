const Discord = require('discord.js');

const regex = /teams(?: of ([0-9]+)){1}/

// take a string of names space seperated
// make sure number can't be bigger than 10
// look up equal array sorting thing

// sheev teams of 2 alex meatball luca kieran

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const chunkArray = (myArray, chunk_size) => {
  let index = 0;
  const arrayLength = myArray.length;
  const tempArray = [];
  
  for (index = 0; index < arrayLength; index += chunk_size) {
      myChunk = myArray.slice(index, index+chunk_size);
      tempArray.push(myChunk);
  }

  return tempArray;
}

// check the remainder
// shuffle
// remove what the remainder is
// do the chunk
// add on at the end

// team list == number to split (invalid)

module.exports = {
  id: 'command_teams',
  canHandle: (message) => {
    return message.content.match(regex);
  },
  handle: (message) => {
    const regexResult = message.content.match(regex);
    const perTeam = regexResult[1];

    const teamList = message.content.substring(regexResult[0].length).trim().split(' ');

    const shuffledTeams = shuffle(teamList);
    const finalTeams = chunkArray(shuffledTeams, perTeam);

    const fields = finalTeams.map((team, index) => {
      const field = { name: `Team #${index + 1}`, value: '' };
      team.map(player => {
        field.value = field.value += `${player}\n`;
      });
      return field;
    });

    const embedObject = {
      fields,
    };

    const embed = new Discord.MessageEmbed(embedObject);

    message.channel.send('So be it...');
    message.channel.send(embed);
  }
};