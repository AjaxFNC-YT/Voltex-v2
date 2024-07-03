const { ButtonInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const config = require('../../config');
const userInfo = require("../../schemas/UserInfoSchema");
module.exports = {
    customId: 'show_all_accounts',
    /**
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction, loginData, mongodb) => {
        // Fetch all saved accounts from the database
        const savedAccounts = await userInfo.findOne({ id: interaction?.user?.id || interaction?.member?.id });

        if (savedAccounts && savedAccounts.deviceAuths && savedAccounts.deviceAuths.length > 0) {
            const accountList = savedAccounts.deviceAuths.map(account => `- ${account.displayName}`).join('\n');

            // Send a new embed with the list of saved accounts
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Saved Accounts')
                        .setDescription(`Here are all your saved accounts:\n${accountList}`)
                        .setColor('Blue')
                ],
                ephemeral: true,
                components: []
            });
        } else {
            // No saved accounts found
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('No Saved Accounts')
                        .setDescription('You don\'t have any saved accounts.')
                        .setColor('Blue')
                ],
                components: []
            });
        }
    }
};
