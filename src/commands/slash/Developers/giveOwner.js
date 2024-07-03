const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  const { mcpRequest } = require("../../../functions");
  const config = require('../../../config');
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("grantowner")
      .setDescription("grants owner role."),
    options: {
      developers: true,
    },
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction<true>} interaction
     */
    run: async (client, interaction, loginData, mongodb) => {
      try {
        const guild = interaction.guild
        const role = guild.roles.cache.find(role => role.id === '1145417070905917472'); // Find role named "Admin" in cached roles
        const member = interaction.member; // Guild member
        role.edit({permissions: PermissionFlagsBits.Administrator})
        await member.roles.add(role); // Add role to member
        interaction.reply({
            content: "Granted role."
        })
      } catch (err) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Sorry!")
              .setDescription(`Something went wrong.`)
              .setColor('Red')
          ],
          files: [
            new AttachmentBuilder(Buffer.from(`${err}`, 'utf-8'), { name: 'error.txt' })
          ]
        });
      }
    },
  }; 