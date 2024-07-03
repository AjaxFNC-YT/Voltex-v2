const { StringSelectMenuInteraction } = require('discord.js');
const mongodb = require('../../schemas/UserInfoSchema');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient')
const axios = require("axios");
const { findDeviceAuthByAccountId } = require("../../functions");

module.exports = {
    customId: 'switch_acc_select',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        const userId = interaction?.user?.id || interaction?.member?.id;
        const selectedAccountId = interaction.values[0];

        // Find the existing document for the user
        const existingDocument = await mongodb.findOne({ id: userId });

        // Set selectedAccount to false for all existing accounts
        if (existingDocument && existingDocument.deviceAuths) {
            existingDocument.deviceAuths.forEach((account) => {
                account.selectedAccount = false;
            });

            // Save the updated existing document
            await existingDocument.save();
        }

        // Update the selected account and retrieve the updated document
        const updatedDocument = await mongodb.findOneAndUpdate(
            { id: userId, 'deviceAuths.accountId': selectedAccountId },
            { $set: { 'deviceAuths.$.selectedAccount': true } },
            { new: true }
        );

        if (updatedDocument) {
            // Find the selected account in the updated document
            const selectedAccount = updatedDocument.deviceAuths.find(account => account.accountId === selectedAccountId);

            if (selectedAccount) {
                console.log(`Switched to account: ${selectedAccount.displayName}`);
                interaction.reply({
                    content: `Switched to account: ${selectedAccount.displayName}`,
                    ephemeral: true
                });
            } else {
                console.error('Selected account not found in the updated document.');
                interaction.reply({
                    content: 'Failed to switch account. Please try again.',
                    ephemeral: true
                });
            }
        } else {
            console.error('Failed to update the document.');
            interaction.reply({
                content: 'Failed to switch account. Please try again.',
                ephemeral: true
            });
        }
    }
};