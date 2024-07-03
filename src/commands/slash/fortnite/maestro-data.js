const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const userInfo = require('../../../schemas/UserInfoSchema');
const { getAccessTokenFromDevice } = require("../../../functions")
const axios = require("axios")
module.exports = {
    structure: new SlashCommandBuilder()
      .setName("maestro-data")
      .setDescription("Grabs all maestro quest data.")
      .addStringOption((option) =>
        option
          .setName("jwt")
          .setDescription("The maestro access token.")
          .setRequired(true)
      ),
    options: {
      developers: false,
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
        } else {
            try {
            maestroAccessToken = interaction.options?.getString('jwt');
            await interaction.deferReply()
            let slided =maestroAccessToken.slice(0, 2)
                  if (!slided == "ey") {
                    interaction.editReply({
                      embeds: [
                        new EmbedBuilder()
                          .setTitle("Error")
                          .setDescription("Invalid JWT provided.")
                          .setTimestamp()
                          .setColor("Red")
                      ]
                    })
                    return;
                  }
                  if (maestroAccessToken.length < 500) {
                    interaction.editReply({
                      embeds: [
                        new EmbedBuilder()
                          .setTitle("Error")
                          .setDescription("Invalid JWT provided.")
                          .setTimestamp()
                          .setColor("Red")
                      ]
                    })
                    return;
                  }
            const questsids = await axios.get(
                `http://45.41.241.34:8080/api/v1/maestro/fetch/fncs?jwt=${maestroAccessToken}`, {}
            );
            const datasids = questsids.data;
            const jsonString = JSON.stringify(datasids); // Convert to JSON string
            const fileBuffer = Buffer.from(jsonString, 'utf-8');
            interaction.editReply({
                files: [
                    new AttachmentBuilder(fileBuffer, { name: `maestro-data.json` })
                 ]
            })
        } catch (e) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(e.message)
                        .setColor("Red")
                        .setTimestamp()
                ]
            })
        }
    }
    }
};