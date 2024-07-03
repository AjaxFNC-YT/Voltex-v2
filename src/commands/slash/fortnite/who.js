const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const userInfo = require('../../../schemas/UserInfoSchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('who')
        .setDescription('Sends who you are logged in as!'),
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
            // Create a button to show all saved accounts
            const showAllAccountsButton = new ButtonBuilder()
                .setLabel('Show All Accounts')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('show_all_accounts');

            // Create an action row containing the button
            const row = new ActionRowBuilder()
                .addComponents(showAllAccountsButton);

            // Send the "Who Am I" embed with the button
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`You are currently logged in as ${loginData.displayName}!`)
                        .setDescription('You are currently logged in. If you wish to logout, you can use the `/logout` command!')
                        .setColor('Green')
                ],
                components: [row]
            });
        }
    }
};