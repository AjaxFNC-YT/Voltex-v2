const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config')
const userInfo = require('../../../schemas/UserInfoSchema');
const { ChatInputCommandInteraction, SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('switch-login')
        .setDescription('Switches your currently logged in account!'),
        options: {
            fortnite: false,
          },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction, loginData, mongodb) => {

        const userId = interaction.user.id;

        // Find the existing document for the user
        const existingDocument = await mongodb.findOne({ id: userId });

        if (!existingDocument || !existingDocument.deviceAuths || existingDocument.deviceAuths.length === 0) {
            // No saved accounts, return an error
            return interaction.reply({
                content: 'You have no saved accounts to switch.',
                ephemeral: true, // Only visible to the user who used the button
            });
        }

        // Create select menu options based on saved accounts
        const selectMenuOptions = existingDocument.deviceAuths.map((account, index) => ({
            label: account.displayName || `Account ${index + 1}`,
            value: account.accountId,
        }));

        // Create a select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('switch_acc_select')
            .setPlaceholder('Select an account to switch')
            .addOptions(selectMenuOptions);

        // Create an action row with the select menu
        const actionRow = new ActionRowBuilder().addComponents(selectMenu);

        // Reply with the select menu
        interaction.reply({
            content: 'Select an account to switch:',
            components: [actionRow],
            ephemeral: true
        });
    }
};