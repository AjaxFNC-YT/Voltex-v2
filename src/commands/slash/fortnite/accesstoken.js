const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const { getAccessTokenFromDevice } = require('../../../functions');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('access')
        .setDescription('Creates and sends a EG1 access token'),
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
            ac = await getAccessTokenFromDevice(loginData.accountId, loginData.deviceId, loginData.secret)
            interaction.reply({
                content: `${ac}`
            })
        }
    }
};