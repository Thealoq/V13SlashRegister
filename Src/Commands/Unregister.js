const config = global.config;
const client = global.client;
const { MessageEmbed } = require("discord.js")
class Commands {
  constructor() {
    this.name = "kayıtsız";
    this.description = "kayıtsıza atar";
    this.options = [
        {
            type: 6,
            description: `lütfen bir kullancı seçin`,
            name: "users",
        },
    ];
  }
  async execute(ctx) {
    const Member = ctx.options._hoistedOptions.find(t => t.name == "users")
    if (!ctx.member.roles.cache.has(config.RegisterHammer) && !ctx.member.permissions.has("ADMINISTRATOR"))return ctx.reply("Yetkiniz Yeterli Değil");
    const member = ctx.guild.members.cache.get(Member.value);
    let embed = new MessageEmbed()
    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({ dynamic: true }) })
    .setFooter({ text: config.footer.toString() , iconURL: ctx.guild.iconURL({ dynamic: true }) })
    .setColor("RANDOM")
    if(!member) return ctx.reply( { embeds : [embed.setDescription("Kayitli Bir Üye Bulunamadi")]})
    if(member.roles.cache.get(config.Unregister)) return ctx.reply( { embeds : [embed.setDescription("etiketlediğin kişi zaten kayıtsız bi üye")]})
    member.setNickname(`${config.Tag} İsim | Yaş`)
    member.roles.set([config.Unregister]).catch(e => {  })
    ctx.reply( { embeds : [embed.setDescription(`${member} Başariyla Kayitsiza Atildi`)]})
    }
}

module.exports = Commands;
