const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  const { mcpRequest } = require("../../../functions");
  const config = require('../../../config');
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("mcp")
      .setDescription("does an mcp request and returns the data.")
      .addStringOption((option) =>
        option
          .setName("operation")
          .setDescription("The operation.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("profile")
          .setDescription("The profile type.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("route")
          .setDescription("normally client or public.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("payload")
          .setDescription("the payload/body of the request.")
          .setRequired(false)
      ),
    options: {
      developers: true,
    },
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction<true>} interaction
     */
    run: async (client, interaction, loginData, mongodb) => {

      if (!config.handler?.mongodb?.toggle) {
        await message.reply({
            content: 'Database is not ready; this command cannot be executed.'
        });

        return;
    }

    let userId = interaction?.user?.id || interaction?.member?.id;
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
      // interaction.reply({
      //   content: "Sorry, this command has a bug and is not ready for use."
      // });
      // return;
      try {
        // Create a file in-memory
        const operationn = interaction.options.getString("operation")
        const profilee = interaction.options.getString("profile")
        const routee = interaction.options.getString("route")
        let payloadd = interaction.options?.getString("payload");
        if (!payloadd) {
          payloadd = {}
        }
        interaction.deferReply()
        const content = mcpRequest(operationn, routee, profilee, payloadd, loginData)
        const fileBuffer = Buffer.from(content, 'utf-8');
        
        await interaction.editReply({
          files: [
            new AttachmentBuilder(fileBuffer, { name: `MCP_output.json` })
          ]
        });
      } catch (err) {
        await interaction.editReply({
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