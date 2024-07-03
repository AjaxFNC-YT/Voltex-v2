const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const userInfo = require('../../../schemas/UserInfoSchema');
const { mcpRequest, getAccessTokenFromDevice } = require('../../../functions');
const axios = require("axios");
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('session-data')
        .setDescription('Grabs your session data.'),
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
                content: 'Database is not ready, this command cannot be executed.'
            });

            return;
        }

        let useridd = interaction?.user?.id || interaction?.member?.id;

        if (!loginData) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Login data not found')
                        .setDescription(`You dont have any accounts saved.`)
                        .setColor('Red')
                ],
                components: []
            });
            return;
        } else {
            const bearer = await getAccessTokenFromDevice(loginData.accountId, loginData.deviceId, loginData.secret);
            const session = await axios.get(`https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/matchmaking/session/findPlayer/${loginData.accountId}`, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${bearer}`,
                }
              })
              try {
                if (session.data[0].totalPlayers != null) {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Success!")
                                .setDescription("I have located your current session.")
                                .addFields([{name:"Real Players", value:`${session.data[0].totalPlayers}`}])
                                .addFields([{name:"Server IP", value:`${session.data[0].serverAddress}`}])
                                .addFields([{name:"Session ID", value:`${session.data[0].id}`}])
                                .addFields([{name:"BucketID", value:`${session.data[0].attributes.BUCKET_S}`}])
                                .setColor("Green")
                                .setTimestamp()
                        ]
                    })
                } else {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Success!")
                            .setDescription("I have located your current session.")
                            .addFields([{name:"Server IP", value:`${session.data[0].serverAddress}`}])
                            .addFields([{name:"Session ID", value:`${session.data[0].id}`}])
                            .addFields([{name:"BucketID", value:`${session.data[0].attributes.BUCKET_S}`}])
                            .setColor("Green")
                            .setTimestamp()
                    ]
                })
                }
              } catch (err) {
                console.log(err)
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error!")
                            .setDescription("Session not found.")
                            .setColor("Red")
                            .setTimestamp()
                            .setFooter({ text: "errors.common.epicgames.com.session.not_found" })
                    ]
                })
                return;
              }
        }
    },
};