const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const userInfo = require('../../../schemas/UserInfoSchema');
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('report-bug')
        .setDescription('reports a bug to the owner.')
        .addStringOption((opt) =>
            opt.setName('command')
                .setDescription('The command with the bug.')
                .setRequired(true)
                )
        .addStringOption((opt2) =>
            opt2.setName('bug')
                .setDescription('The bug that the command has.')
                .setRequired(true)
                ),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction, _loginData, mongodb) => {

              let useridd = interaction?.user?.id || interaction?.member?.id
              let buggedcommand = interaction.options.getString('command');
              let bugwithcommand = interaction.options.getString('bug');
              const channel = await client.channels.cache.get("1132220491684392991");
              const embed = new EmbedBuilder()
              .setColor("Blurple")
              .setTitle(`Bug report from ${interaction.user.username}`)
              .addFields({ name: "UserID", value: `${useridd}` })
              .addFields({ name: "Member", value: `${interaction.member}` })
              .addFields({ name: "Command Reported", value: `${buggedcommand}` })
              .addFields({ name: "Report description", value: `${bugwithcommand}` })
              .setTimestamp()
              .setFooter({ text: "Voltex reporting system" })
              await channel.send({ embeds: [ embed ] }).catch(err => {});
                 interaction.reply({
                      content: "Your report has been submitted.",
                      ephemeral: true
                  });


    }
};