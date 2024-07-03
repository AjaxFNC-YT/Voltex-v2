const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const { getAccessTokenFromDevice, getExchangeFromAccess } = require("../../../functions");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName("playtime-max")
        .setDescription("Sets the playtime to the maximum amount."),
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
            const maxPlaytime = 30000; // 50,000 hours
            let currentPlaytime = 0;
            const increment = 699;
            const bearer = await getAccessTokenFromDevice(loginData.accountId, loginData.deviceId, loginData.secret);
            const exchange = await getExchangeFromAccess(bearer, loginData);
            let launcheraccess;
            console.log(exchange)
            const url2 = 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token';
            const data = `grant_type=exchange_code&exchange_code=${exchange.code}`;
            const headers2 = {
                'Authorization': 'Basic MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=',
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            await axios.post(url2, data, { headers: headers2 })
                .then(response => {

                    if (response.status !== 200) {
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Error")
                                    .setDescription(`Failed to generate launcher token!`)
                                    .setColor('Red')
                            ]
                        });
                        return;
                    } else if (response.status === 200) {
                        launcheraccess = response.data.access_token;
                    }
                })
                .catch(error => {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Error")
                                .setDescription(`Failed to generate launcher token!`)
                                .setColor('Red')
                        ]
                    });
                    console.error('Error:', error.response.data);
                    return;
                });

            
            while (currentPlaytime < maxPlaytime) {
                let duration = increment * 60 * 60000;
                const machineId = uuidv4();

                const endTime = new Date().toISOString();
                const startTime = new Date(Date.now() - duration).toISOString();

                let url = `https://library-service.live.use1a.on.epicgames.com/library/api/public/playtime/account/${loginData.accountId}`;
                let body = {
                    "machineId": machineId,
                    "artifactId": "Fortnite",
                    "startTime": startTime,
                    "endTime": endTime,
                    "startSegment": true,
                    "endSegment": true
                };
                const configg = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${launcheraccess}`
                    }
                };

                await axios.put(url, body, configg);

                currentPlaytime += increment;
            }

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Playtime Added")
                        .setDescription(`Successfully added 30,000 hours to your epicgames account.`)
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
