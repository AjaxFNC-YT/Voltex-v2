const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder,
  } = require("discord.js");
  const ExtendedClient = require("../../../class/ExtendedClient");
  
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("createfile")
      .setDescription("Create a file with content.")
      .addStringOption((option) =>
        option
          .setName("content")
          .setDescription("The content for the file.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("the name of the file")
          .setRequired(true)
      ),
    options: {
      developers: true,
    },
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction<true>} interaction
     */
    run: async (client, interaction, loginData, mongodb) => {
      await interaction.deferReply();
  
      const content = interaction.options.getString("content");
      const fileName = interaction.options.getString("name");
  
      try {
        // Create a file in-memory



        
        const fileBuffer = Buffer.from(content, 'utf-8');
  
        await interaction.editReply({
          files: [
            new AttachmentBuilder(fileBuffer, { name: `${fileName}` })
          ]
        });






      } catch (err) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(`Something went wrong while creating the file.`)
              .setColor('Red')
          ],
          files: [
            new AttachmentBuilder(Buffer.from(`${err}`, 'utf-8'), { name: 'error.txt' })
          ]
        });
      }
    },
  }; 