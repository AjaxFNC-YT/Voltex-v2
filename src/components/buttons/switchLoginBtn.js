const { StringSelectMenuInteraction, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const mongodb = require('../../schemas/UserInfoSchema');
const { EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const axios = require("axios");

module.exports = {
    customId: 'switch_acc',
    run: async (client, interaction) => {
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
    },
};