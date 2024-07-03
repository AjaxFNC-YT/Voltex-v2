const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const { getAccessTokenFromDevice, getExchangeFromAccess } = require("../../../functions");
const axios = require("axios");

module.exports = {
    structure: new SlashCommandBuilder()
        .setName("launcher-token")
        .setDescription("Provides a launcher token."),
    options: {
        fortnite: true,
    },
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction, loginData, mongodb) => {
        if (!loginData) {
            await interaction.reply({
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
            const bearer = await getAccessTokenFromDevice(loginData.accountId, loginData.deviceId, loginData.secret);
            const exchange = await getExchangeFromAccess(bearer, loginData);

            const url = 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token';
            const data = `grant_type=exchange_code&exchange_code=${exchange.code}`;
            const headers = {
                'Authorization': 'Basic MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=',
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            const response = await axios.post(url, data, { headers });

            if (response.status !== 200) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error")
                            .setDescription(`Failed to generate launcher token!`)
                            .setColor('Red')
                    ]
                });
                return;
            }

            const launcheraccess = response.data.access_token;
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Success!")
                        .setDescription(`Launcher token: ${launcheraccess}`)
                        .setColor('Green')
                ],
                ephemeral: true
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
            console.error(err);
        }
    },
};
