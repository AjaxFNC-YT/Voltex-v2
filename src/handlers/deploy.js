const { REST, Routes } = require("discord.js");
const { log } = require("../functions");
const config = require("../config");
const ExtendedClient = require("../class/ExtendedClient");

/**
 * Load or reload application commands for the bot.
 * @param {ExtendedClient} client 
 * @param {boolean} reload - Whether to reload the commands.
 */
const loadApplicationCommands = async (client, reload = false) => {
  const rest = new REST({ version: "10" }).setToken(
    process.env.CLIENT_TOKEN || config.client.token
  );

  try {
    const guildId = process.env.GUILD_ID || config.development.guild;

    if (reload) {
      // Reload logic here, if needed
      // For example, you could clear and rebuild the commands array
      client.applicationcommandsArray = [];
      // Additional logic to rebuild the commands array (similar to the loading logic)
    }

    log(
      `Started ${reload ? 'reloading' : 'loading'} application commands... (this might take minutes!)`,
      "info"
    );

    if (config.development && config.development.enabled) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID || config.client.id, guildId),
        {
          body: client.applicationcommandsArray,
        }
      );
      log(`Successfully ${reload ? 'reloaded' : 'loaded'} application commands to guild ${guildId}.`, "done");
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID || config.client.id),
        {
          body: client.applicationcommandsArray,
        }
      );
      log(`Successfully ${reload ? 'reloaded' : 'loaded'} application commands globally to Discord API.`, "done");
    }
  } catch (e) {
    log(`Unable to ${reload ? 'reload' : 'load'} application commands to Discord API. \n${e}`, "err");
  }
};

module.exports = loadApplicationCommands;
