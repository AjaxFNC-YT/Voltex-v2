const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const userInfo = require('../../../schemas/UserInfoSchema');
const { mcpRequest, getAccessTokenFromDevice, getExchangeFromAccess } = require('../../../functions');
const axios = require("axios");
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('launch')
        .setDescription('Returns code to launch the game on windows.'),
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
            const exchange = await getExchangeFromAccess(bearer, loginData);
            if (exchange.status != 401) {
            let code = `start /d "C:\\Program Files\\Epic Games\\Fortnite\\FortniteGame\\Binaries\\Win64" FortniteLauncher.exe -AUTH_LOGIN=unused -AUTH_PASSWORD=${exchange.code} -AUTH_TYPE=exchangecode -epicapp=Fortnite -epicenv=Prod -EpicPortal -epicuserid=${loginData.accountId}`;

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Enter the code below in a cmd to start fortnite with the account: ${loginData.displayName}`)
                        .setDescription("Will Launch as: __" + loginData.displayName + "__\nCode:```\n"+ code + "```")
                        .setTimestamp()
                        .setColor("Green")
                ],
                ephemeral: true
            })
            } else {
              interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Error`)
                        .setDescription("Failed to generate a exchange code.")
                        .setTimestamp()
                        .setColor("Red")
                ],
                ephemeral: true
            })
            }
        }
    },
};