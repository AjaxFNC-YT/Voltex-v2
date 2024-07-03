const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const userInfo = require('../../../schemas/UserInfoSchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Sends the uptime for the discord bot'),
        options: {
            fortnite: true,
        },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction, loginData, mongodb) => {
        let totalSeconds = Math.floor(client.uptime / 1000);
        let weeks = Math.floor(totalSeconds / 604800);
        totalSeconds %= 604800;
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `${weeks} weeks, ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Client Uptime')
                    .setDescription(`${uptime}`)
                    .setColor('Green')
            ],
        });
    }
};