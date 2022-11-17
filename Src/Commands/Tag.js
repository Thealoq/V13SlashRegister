const config = global.config;
const client = global.client;
const { MessageEmbed } = require("discord.js")
class Commands {
  constructor() {
    this.name = "tag";
    this.description = "tagi gösterir";
    this.options = [];
  }
  async execute(ctx) {
    let embed = new MessageEmbed()
    .setColor(`RANDOM`)
  ctx.reply({
    embeds: [embed.setDescription(`
  \`❯\` Sunucumuzun Tagi \`${config.Tag}\` `)]
  })
    }
}

module.exports = Commands;
 