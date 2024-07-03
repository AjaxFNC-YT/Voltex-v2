const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!'),
    options: {
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction, loginData, mongodb) => {
        const botPingStart = Date.now();
        await interaction.reply({
            content: 'Pinging...',
        }).then(sent => {
            const botPing = Date.now() - botPingStart;
            const discordPing = client.ws.ping;

            sent.edit(`Pong!\nDiscord Ping: ${discordPing}ms\nBot Ping: ${botPing}ms`);
        });
    }
};
