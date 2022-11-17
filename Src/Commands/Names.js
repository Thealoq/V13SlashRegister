const config = global.config;
const client = global.client;
const { MessageEmbed } = require("discord.js")
const Data = require("../schema/User")
class Commands {
  constructor() {
    this.name = "isimler";
    this.description = "isim değiştirme komutu";
    this.options = [
      {
        type: 6,
        description: `lütfen bir kullancı seçin`,
        name: "users",
      },
    ];
  }
  async execute(ctx) {
    let embed = new MessageEmbed()
    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({ dynamic: true }) })
    .setFooter({ text: config.footer.toString() , iconURL: ctx.guild.iconURL({ dynamic: true }) })
    .setColor("RANDOM")
    if (!ctx.member.roles.cache.has(config.RegisterHammer) && !ctx.member.permissions.has("ADMINISTRATOR"))return ctx.reply("Yetkiniz Yeterli Değil");
    const Member = ctx.options._hoistedOptions.find(t => t.name == "users")
    if(!Member) return ctx.reply( { embeds : [embed.setDescription("Kayitli Bir Üye Bulunamadi")]})
      const member = ctx.guild.members.cache.get(Member.value);
      let UyeData = await Data.find({ GuildId: ctx.guild.id, Member: member.id });
      let WomanRole = config.Woman
      let ManRole = config.Man
      const MemberData = `${UyeData.map(x => `Yetkili: [<@${x.Executor}>]  \`${x.Name}\` (${x.role === "Erkek" ? `<@&${ManRole}>` : `<@&${WomanRole}> `})
       `).join("\n ")}`
       if (MemberData) {
        ctx.reply({ embeds: [embed.setDescription(`• ${member} Adlı Kişinin isim geçmişi \n\n ${MemberData}`)] }).then(msg => {
        })
        } else {
        ctx.reply({ embeds: [embed.setDescription(`Daha Önceden Kayit Olmamiş`)]}).then(msg => {
        })
    }
    }
}

module.exports = Commands;
