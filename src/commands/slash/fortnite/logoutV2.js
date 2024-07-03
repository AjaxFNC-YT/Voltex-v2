const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongodb = require('../../../schemas/UserInfoSchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('logout')
        .setDescription('Logouts the currently selected Epic Games account.'),
        options: {
            fortnite: false,
        },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction, loginData, mongodb) => {
        const userId = interaction?.user?.id || interaction?.member?.id;
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
        }

        // Find the existing document for the user
        const existingDocument = await mongodb.findOne({ id: userId });

        if (existingDocument && existingDocument.deviceAuths) {
            // Find the currently selected account
            const selectedDeviceAuth = existingDocument.deviceAuths.find(deviceAuth => deviceAuth.selectedAccount);

            if (selectedDeviceAuth) {
                const accountIdToDelete = selectedDeviceAuth.accountId;

                // Update the document to remove the selected account
                const result = await mongodb.updateOne(
                    { id: userId },
                    { $pull: { deviceAuths: { accountId: accountIdToDelete } } }
                );

                if (result.modifiedCount > 0) {
                    console.log(`DeviceAuth with accountId ${accountIdToDelete} deleted from document`);
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Logged Out!')
                                .setDescription(`You have been logged out of the account: ${selectedDeviceAuth.displayName}`)
                                .setColor('Green')
                        ],
                    });
                } else {
                    console.log(`No document found with accountId ${accountIdToDelete}`);
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Login Data Not found')
                                .setDescription(`I haven't found any loginData for this user.`)
                                .setColor('Red')
                        ],
                    });
                }
            } else {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('No Account Selected')
                            .setDescription('No Epic Games account is currently selected.')
                            .setColor('Red')
                    ],
                });
            }

            // Check the remaining number of accounts
            const remainingAccounts = existingDocument.deviceAuths.length - 1;

            if (remainingAccounts === 0) {
                // If there are no remaining accounts, delete the entire user data
                await mongodb.deleteOne({ id: userId });
                console.log(`All accounts deleted for user ${userId}`);
            }
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('No Account Found')
                        .setDescription('No Epic Games account found for this user.')
                        .setColor('Red')
                ],
            });
        }
    }
};
