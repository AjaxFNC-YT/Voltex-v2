const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const loadCommmands = require("../../../handlers/commands");
const loadEvents = require("../../../handlers/events");

module.exports = {
    structure: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads events or commands for the bot.")
        .addSubcommand(subcommand =>
        subcommand.setName('events')
          .setDescription('Reload all events!')
      )
        .addSubcommand(subcommand =>
        subcommand.setName('commands')
          .setDescription('Reload all commands!')
        ),
    options: {
        developers: true,
    },
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction<true>} interaction
     */
    run: async (client, interaction, loginData, mongodb) => {
        const sub = interaction.options.getSubcommand();
        const embed = new EmbedBuilder()
            .setTitle('Developer')
            .setColor('Blue');
        const user = interaction?.user?.id || interaction?.member?.id

        switch (sub) {
            case 'commands':
                loadCommmands(client); // Pass the instance of ExtendedClient
                interaction.reply({ embeds: [embed.setDescription('Commands Reloaded!')] });
                console.log(`${user} has reloaded all commands.✅`);
                break;
            case 'events':
                loadEvents(client); // Pass the instance of ExtendedClient
                interaction.reply({ embeds: [embed.setDescription('Events Reloaded!')] });
                console.log(`${user} has reloaded all events ✅`);
                break;
        }
    }
};