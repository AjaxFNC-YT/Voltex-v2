const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const userInfo = require('../../../schemas/UserInfoSchema');
const { mcpRequest, getAccessTokenFromDevice } = require('../../../functions');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('hero-glitch')
        .setDescription('does the fortnite stw hero glitch')
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("the amount to do the hero glitch.")
                .setRequired(true)
        ),
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
        interaction.reply({
            content: "Sorry, this command doesnt work anymore because its patched :(",
            ephemeral: true 
        })
        if (!loginData) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Login data not found')
                        .setDescription(`You dont have any accounts saved.`)
                        .setColor('Red')
                        .setTimestamp()
                ],
                components: []
            });
            return;
        } else {
            const amount = interaction.options.getInteger("amount");
            const totalIterations = parseInt(amount);
            let completedIterations = 0;

            if (amount > 1000 || parseInt(amount) > 1000) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('The Amount must be below 1000 [PH].')
                            .setTimestamp()
                    ]
                });
                return;
            }

            if (amount == 0 || parseInt(amount) == 0) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('The amount must be higher than zero.')
                            .setTimestamp()
                    ]
                });
                return;
            }

            const profile = await mcpRequest("QueryProfile", "client", "campaign", {}, loginData);
            const c_loadout = profile.profileChanges[0].profile.stats.attributes.selected_hero_loadout;

            const startTime = Date.now();
            // Find the n_loadout here
            const n_loadout = Object.keys(profile.profileChanges[0].profile.items).find(key => {
                const m = profile.profileChanges[0].profile.items[key];
                return m.templateId.includes('CampaignHeroLoadout') && m.templateId !== c_loadout;
            });

            // Calculate time for a single iteration
            await mcpRequest("SetActiveHeroLoadout", "client", "campaign", { 'selectedLoadout': n_loadout }, loginData);
            await mcpRequest("SetActiveHeroLoadout", "client", "campaign", { 'selectedLoadout': c_loadout }, loginData);
            const endTime = Date.now();
            const timePerIteration = (endTime - startTime) / 1000; // Convert to seconds

            const message = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle(`I am currently doing the hero glitch ${amount} times\n(ETA: Calculating)`)
                        .setFooter({ text: `Progress: 0/${totalIterations}` })
                        .setTimestamp()
                ],
                components: []
            });

            for (let i = 0; i < totalIterations; i++) {
                await mcpRequest("SetActiveHeroLoadout", "client", "campaign", { 'selectedLoadout': n_loadout }, loginData);
                await mcpRequest("SetActiveHeroLoadout", "client", "campaign", { 'selectedLoadout': c_loadout }, loginData);

                completedIterations++;

                // Update message with ETA and progress
                const remainingIterations = totalIterations - completedIterations;
                const remainingTime = remainingIterations * timePerIteration;
                const etaMessage = `ETA: ${Math.round(remainingTime)} seconds`;
                const progressMessage = `Progress: ${completedIterations}/${totalIterations}`;

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blue")
                            .setTitle(`I am currently doing the hero glitch ${amount} times, please wait (${etaMessage})`)
                            .setFooter({ text: progressMessage })
                            .setTimestamp()
                    ],
                    components: []
                });
            }
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setTitle(`Hero Glitch Completed! Your hero was swapped \`${amount}\` times!`)
                        .setTimestamp()
                ],
                components: []
            });
        }
    },
};
