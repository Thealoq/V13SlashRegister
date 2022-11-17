const config = global.config;
const client = global.client;
const MemberData = require("../schema/User")
const OwnerData = require("../schema/Owner")
let tag = new RegExp(config.Tag)
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
class Commands {
  constructor() {
    this.name = "kayıt";
    this.description = "kayıt komutu";
    this.options = [
      {
        type: 6,
        description: `lütfen bir kullancı seçin`,
        name: "users",
      },
      {
        type: 3,
        description: `lütfen bi isim belirleyin`,
        name: "name",
      },
      {
        type: 4,
        description: `lütfen bi yaş belirleyin`,
        name: "age",
      },
    ];
  }
  async execute(ctx) {
    if (!ctx.member.roles.cache.has(config.RegisterHammer) && !ctx.member.permissions.has("ADMINISTRATOR"))return ctx.reply("Yetkiniz Yeterli Değil");
    const Member = ctx.options._hoistedOptions.find(t => t.name == "users")
    const Name = ctx.options._hoistedOptions.find(t => t.name == "name")
    const Age = ctx.options._hoistedOptions.find(t => t.name == "age")
    let embed = new MessageEmbed().setColor("RANDOM").setAuthor({name: ctx.guild.name, iconURL: ctx.guild.iconURL({ dynamic: true }), }).setFooter({text: config.footer.toString(),iconURL: ctx.user.avatarURL({ dynamic: true }),});
    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
          .setCustomId('erkek')
          .setEmoji(`🙍‍♂️`)
          .setStyle('SECONDARY'))
  .addComponents(
      new MessageButton()
          .setCustomId('kız')
          .setStyle('SECONDARY')
          .setEmoji(`🙍‍♀️`))
  .addComponents(
      new MessageButton()
          .setCustomId('iptal')
          .setEmoji(`❌`)
          .setStyle('SECONDARY'))
    if (!Member || !Age || !Name ) return ctx.reply({ embeds: [embed.setDescription(`[❌] Kullanım hatası.\n Yanlış Kullandin. 👋 \`Örnek: /Kayıt [@Thealoq] [Isim] [Yas] \` `)] })
    if (Name.length > 12) return ctx.reply(`uzunluk 12den fazla olamaz`)
    if (Age < 15) return ctx.reply({ embeds: [embed.setDescription(`Yaşın 15den küçük olamaz.`)] })  
    if(Member.user.bot) return ctx.reply({ embeds: [embed.setDescription(`botlari kayit edemezsin`)] })
    const roles = Member.member._roles;
    if (roles.includes(config.Man) ||roles.includes(config.Woman)) return ctx.reply({ embeds: [embed.setDescription(`kayıtlı user tekrar kayıt edemezsin`)] })
    let UserData = await MemberData.find({ GuildId: ctx.guild.id, member: Member.value });
    let WomanRole = config.Woman
    let ManRole = config.Man
    const MemberReg = `${UserData.map(x => `• <@${x.Member}> Üyesi \`${x.Name}\` Adıyla ${x.Role === "Erkek" ? `<@&${ManRole}>` : `<@&${WomanRole}>`} Olarak Kayıt Oldu`).join("\n ")}`
    ctx.reply({ embeds : [!UserData.length ? embed.setDescription(`Lütfen Cinsiyetini Belirleyin  👑 \n\n Daha Önceden Giriş Yapmamiş`) : embed.setDescription(`Lütfen Cinsiyetini Belirleyin 👑 \n\n\ Daha Önceden 🙆‍♂️ \n\n ${MemberReg}`)] , components: [row] })
    const filter = i => i.user.id === ctx.member.id;
    const collector = ctx.channel.createMessageComponentCollector({ filter, time: 60000 });
    const obj = {
      erkek: funcMan,
      kız: funcWoman,
      iptal: funcRemove
    }
    const member = ctx.guild.members.cache.get(Member.value);
    
    collector.on('collect', async b => {
        if (b.isButton()) {
            const func = obj[b.customId];
            if (typeof func === "function") func(ctx, embed, member, Member, Name, Age);
          }
          collector.stop()
        })
  }
}

async function funcMan(ctx, embed, member, Member, Name, Age) {
  let Control = Member.user.username.includes(config.Tag)
  Control ? member.roles.set([config.Man, config.Family]) : member.roles.set([config.Man])
  await member.setNickname(`${Control ? config.Tag : config.Tagsız} ${Name.value.charAt(0).toUpperCase() + Name.value.slice(1).toLowerCase()} | ${Age.value}`)
  ctx.editReply({ embeds: [embed.setDescription(`${member}(\`${member.id}\`) \n\n Kullanıcı \`${member.displayName}\` Olarak Değiştirildi ve <@&${config.Man}> Rolü Verildi `)], components: [] })
  new MemberData({ 
  GuildId: ctx.guild.id, 
  Executor: ctx.member.id, 
  Member: member.id, 
  Name: `${member.displayName}`, 
  Role: "Erkek" }).save().catch(t => { }) 
  let ManReg = new OwnerData({ GuildId: ctx.guild.id, Member: ctx.member.id, TotalReg: 1, WomanReg: 0, ManReg: 1 })

  let ManDB = await OwnerData.findOne({ GuildId: ctx.guild.id, Member: ctx.member.id })
  if (!ManDB) await ManReg.save().catch(e => { console.error(e) })
    const veri = await OwnerData.findOne({ GuildId: ctx.guild.id, Member: ctx.member.id });
    veri.TotalReg++
    veri.ManReg++
    veri.save().catch(e => { console.error(e) })
}

async function funcWoman(ctx, embed, member, Member, Name, Age) {
  let Control = Member.user.username.includes(config.Tag)
  Control ? member.roles.set([config.Woman, config.Family]) : member.roles.set([config.Woman])
  await member.setNickname(`${Control ? config.Tag : config.Tagsız} ${Name.value.charAt(0).toUpperCase() + Name.value.slice(1).toLowerCase()} | ${Age.value}`)
  ctx.editReply({ embeds: [embed.setDescription(`${member}(\`${member.id}\`) \n\n Kullanıcı \`${member.displayName}\` Olarak Değiştirildi ve <@&${config.Woman}> Rolü Verildi `)], components: [] })
  new MemberData({ 
  GuildId: ctx.guild.id, 
  Executor: ctx.member.id, 
  Member: member.id, 
  Name: `${member.displayName}`, 
  Role: "Kadın" }).save().catch(t => { })
  let ManReg = new OwnerData({ GuildId: ctx.guild.id, Member: ctx.member.id, TotalReg: 1, WomanReg: 1, ManReg: 0 })
  let ManDB = await OwnerData.findOne({ GuildId: ctx.guild.id, Member: ctx.member.id })
  if (!ManDB) await ManReg.save().catch(e => { console.error(e) })
    const veri = await OwnerData.findOne({ GuildId: ctx.guild.id, Member: ctx.member.id });
    veri.TotalReg++
    veri.WomanReg++
    veri.save().catch(e => { console.error(e) })
}

async function funcRemove(ctx) {
  ctx.editReply('İşlem iptal edildi')
}
module.exports = Commands;
