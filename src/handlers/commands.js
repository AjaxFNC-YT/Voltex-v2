const { readdirSync } = require('fs');
const { log } = require('../functions');
const ExtendedClient = require('../class/ExtendedClient');
const path = require('path');

/**
 * Register commands for the bot.
 * @param {ExtendedClient} client 
 */
const registerCommands = (client) => {
  // Clear the cache for the commands directory
  const commandsPath = path.join(__dirname, '..', 'commands');
  if (require.cache[commandsPath]) {
    delete require.cache[commandsPath];
  }

  for (const type of readdirSync("./commands/")) {
    for (const dir of readdirSync("./commands/" + type)) {
      for (const file of readdirSync("./commands/" + type + '/' + dir).filter((f) => f.endsWith('.js'))) {
        const modulePath = path.join(__dirname, '..', 'commands', type, dir, file);

        // Clear the cache for the specific command module
        if (require.cache[modulePath]) {
          delete require.cache[modulePath];
        }

        const module = require(modulePath);

        if (!module) continue;

        if (type === 'prefix') {
          if (!module.structure?.name || !module.run) {
            log('Unable to load the command ' + file + ' due to missing \'structure#name\' or/and \'run\' properties.', 'warn');
            continue;
          }

          client.collection.prefixcommands.set(module.structure.name, module);

          if (module.structure.aliases && Array.isArray(module.structure.aliases)) {
            module.structure.aliases.forEach((alias) => {
              client.collection.aliases.set(alias, module.structure.name);
            });
          }
        } else {
          if (!module.structure?.name || !module.run) {
            log('Unable to load the command ' + file + ' due to missing \'structure#name\' or/and \'run\' properties.', 'warn');
            continue;
          }

          client.collection.interactioncommands.set(module.structure.name, module);
          client.applicationcommandsArray.push(module.structure);
        }

        log('Loaded/reloaded command: ' + file, 'info');
      }
    }
  }
};

module.exports = registerCommands;
