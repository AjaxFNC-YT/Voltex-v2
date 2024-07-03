const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const userInfo = require('../../../schemas/UserInfoSchema');
const { mcpRequest, getAccessTokenFromDevice, getExchangeFromAccess } = require('../../../functions');
const axios = require("axios");
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('weblogin')
        .setDescription('Returns a link to login to epicgames.'),
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
            if (exchange.status === 200 || exchange.status === 204) {
                const webloginBtn = new ButtonBuilder()
                .setLabel('Login to Epicgames')
                .setStyle(ButtonStyle.Link)
                .setDisabled(false)
                .setURL(`https://epicgames.com/id/exchange?exchangeCode=${exchange.code}`);
      
                const row = new ActionRowBuilder()
                    .addComponents(webloginBtn);


            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Success!`)
                        .setDescription("Click the button below to login to epicgames")
                        .setTimestamp()
                        .setColor("Green")
                ],
                components: [
                  row
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