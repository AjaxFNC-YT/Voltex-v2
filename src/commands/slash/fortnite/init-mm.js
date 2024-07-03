const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  const { mcpRequest } = require("../../../functions")
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("ininitalize-profile")
      .setDescription("Ininitalizes your fortnite matchmaking profile."),
      options: {
      fortnite: true,
    },
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction, loginData, mongodb) => {
      if (!loginData) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Login data not found')
                    .setDescription(`You don't have any accounts saved.`)
                    .setColor('Red')
            ],
            components: []
        });
        return;
    }


      await interaction.deferReply();

  
      try {
        await mcpRequest("QueryProfile", "client", "athena", {}, loginData)
        await mcpRequest("QueryProfile", "client", "common_core", {}, loginData)
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Successfully Initialized.")
              .setDescription(`Your profile for the account: ${loginData.displayName} has been initialized for matchmaking.`)
              .setColor('Green')
              .setTimestamp()
          ],
        });
      } catch (err) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(`Something went wrong while executing.`)
              .setColor('Red')
          ],
        });
        console.log(err);
      };
  
    },
  };
  