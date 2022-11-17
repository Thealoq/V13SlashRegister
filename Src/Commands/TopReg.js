const config = global.config;
const client = global.client;
const { MessageEmbed } = require("discord.js")
const RegisterData = require("../schema/Owner")
class Commands {
  constructor() {
    this.name = "topteyit";
    this.description = "top teyit gösterir";
    this.options = [];
  }
  async execute(ctx) {
    let embed = new MessageEmbed()
    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({ dynamic: true }) })
    .setFooter({ text: config.footer.toString() , iconURL: ctx.guild.iconURL({ dynamic: true }) })
    .setColor("RANDOM")
    let RegisterSiralama = await RegisterData.find({ GuildId: ctx.guild.id }).sort({ TotalReg: -1 }).exec();
    if(RegisterSiralama.length === 0) return ctx.reply({ embeds: [embed.setDescription(`Herhangi bir kayıt verisi bulunamadı!`)]})
    RegisterSiralama = RegisterSiralama.filter(x => ctx.guild.members.cache.has(x.ManReg) ||  x.TotalReg).splice(0, 10)
    ctx.reply({embeds : [embed.setDescription(RegisterSiralama.map((x, i) => `\`${i+1}.\` <@${x.Member}> Toplam **${x.TotalReg}** (\`${x.ManReg} Erkek ${x.WomanReg} Kız\`)`).join(" \n").toString())]})
    }
}

module.exports = Commands;
