const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const { getAccessTokenFromDevice, getExchangeFromAccess } = require("../../../functions");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName("playtime-add")
        .setDescription("Adds playtime to the epicgames launcher")
        .addIntegerOption(option =>
            option
                .setName("hours")
                .setDescription("The playtime in hours to add, e.g. 1")
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
            const playtimeInput = interaction.options.getInteger('hours');

            if (isNaN(playtimeInput) || playtimeInput <= 0) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Invalid playtime')
                            .setDescription(`The playtime must be a positive number.`)
                            .setColor('Red')
                    ],
                    components: []
                });
                return;
            }

            if (playtimeInput > 650) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Invalid playtime')
                            .setDescription(`Playtime cannot exceed 650 hours.`)
                            .setColor('Red')
                    ],
                    components: []
                });
                return;
            }

            // Calculate playtime duration in milliseconds
            const duration = playtimeInput * 60 * 1000;
            const machineId = uuidv4();

            const endTime = new Date().toISOString();
            const startTime = new Date(Date.now() - duration).toISOString();

            const url = `https://library-service.live.use1a.on.epicgames.com/library/api/public/playtime/account/${loginData.accountId}`;
            const body = {
                machineId: machineId,
                artifactId: "Fortnite",
                startTime: startTime,
                endTime: endTime,
                startSegment: true,
                endSegment: true
            };

            const bearer = await getAccessTokenFromDevice(loginData.accountId, loginData.deviceId, loginData.secret);
            const exchange = await getExchangeFromAccess(bearer, loginData);

            const url2 = 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token';
            const data = `grant_type=exchange_code&exchange_code=${exchange.code}`;
            const headers2 = {
                'Authorization': 'Basic MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=',
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            const response = await axios.post(url2, data, { headers: headers2 });
            if (response.status !== 200) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error")
                            .setDescription(`Failed to generate launcher token!`)
                            .setColor('Red')
                    ],
                    components: []
                });
                return;
            }
            const launcheraccess = response.data.access_token;

            const configg = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${launcheraccess}`
                }
            };

            await axios.put(url, body, configg);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Playtime Added")
                        .setDescription(`Successfully added ${playtimeInput} hour(s).`)
                        .setColor('Green')
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
            console.error(err);
        }
    },
};