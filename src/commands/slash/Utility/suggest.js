const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const userInfo = require('../../../schemas/UserInfoSchema');
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggests a feature to the owner.')
        .addStringOption((opt) =>
            opt.setName('suggestion')
                .setDescription('The suggestion/feature you want.')
                .setRequired(true)
                ),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction, _loginData, mongodb) => {

              let useridd = interaction?.user?.id || interaction?.member?.id
              let ss = interaction.options.getString('suggestion');
              const channel = await client.channels.cache.get("1132220490258317452");
              console.log(interaction.user)
              const embed = new EmbedBuilder()
              .setColor("Blue")
              .setTitle(`Suggestion from ${interaction.user.username}`)
              .addFields({ name: "UserID", value: `${useridd}` })
              .addFields({ name: "Member", value: `${interaction.member}` })
              .addFields({ name: "Suggestion", value: `${ss}` })
              .setTimestamp()
              .setFooter({ text: "Voltex suggesting system" })
              await channel.send({ embeds: [ embed ] }).catch(err => {});
                 interaction.reply({
                      content: "Your suggestion has been submitted.",
                      ephemeral: true
                  });


    }
};