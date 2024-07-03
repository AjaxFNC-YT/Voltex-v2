const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const userInfo = require('../../../schemas/UserInfoSchema');
//const {  } = require("../../../functions")
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('fav')
        .setDescription('favorites a playlist with its id')
        .addStringOption((option) =>
        option
            .setName("playlistid")
            .setDescription("The playlistId")
            .setRequired(true)
    ),
        options: {
            fortnite: true,
        },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
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
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Command not working')
                        .setDescription(`Sorry this command isnt working just yet.`)
                        .setColor('Red')
                ],
                components: []
            });
            return;
        }
    }
};