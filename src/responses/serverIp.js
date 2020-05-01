const triggerPrases = [
  'minecraft ip',
  'server ip',
  'server address'
];

const check = (messageContent) => {
  triggerPrases.forEach(phrase => {
    if (messageContent.includes(phrase)) return true;
  })
  return false;
};

module.exports = {
  id: 'response_minecraft_ip',
  canHandle: (message) => {
    return check(message.content);
  },
  handle: (message) => {

    const fields = [
      { name: 'Feed The Beast', value: 'TheSenate.playat.ch:25565' },
      { name: 'Minigames', value: 'TheSenate.playat.ch:25566' },
      { name: 'Hardcore', value: 'TheSenate.playat.ch:25567' }
    ];

    const embed = new Discord.MessageEmbed({ fields });
    message.channel.send(embed);
  }
};
