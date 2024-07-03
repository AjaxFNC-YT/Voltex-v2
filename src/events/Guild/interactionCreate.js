const config = require("../../config");
const { EmbedBuilder } = require('discord.js');
const { log, sendErrorLog } = require("../../functions");
const ExtendedClient = require("../../class/ExtendedClient");
const mongodb = require('../../schemas/UserInfoSchema');
const userData = require("../../schemas/UserDataSchema")
const axios = require("axios");
const { getAccessTokenFromDevice, mcpRequest } = require("../../functions")
const cooldown = new Map();

module.exports = {
  event: "interactionCreate",
  /**
   *
   * @param {ExtendedClient} client
   * @param {import('discord.js').Interaction} interaction
   * @returns
   */
  run: async (client, interaction) => {
    if (!interaction.isCommand()) return;
    user = interaction?.user?.id || interaction?.member?.id
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`A command was ran.`)
      .setDescription(`<@${user}> ran the command: ${interaction.commandName}`)
      .setTimestamp();
    const logginchannel = "1200990441651306636";
    let channel = await client.channels.cache.get(logginchannel);
    await channel.send({ embeds: [embed] });
    if (
      config.handler.commands.slash === false &&
      interaction.isChatInputCommand()
    )
      return;
    if (
      config.handler.commands.user === false &&
      interaction.isUserContextMenuCommand()
    )
      return;
    if (
      config.handler.commands.message === false &&
      interaction.isMessageContextMenuCommand()
    )
      return;

    const command = client.collection.interactioncommands.get(
      interaction.commandName
    );

    if (!command) return;

    try {
      if (command.options?.developers) {
        if (
          config.users?.developers?.length > 0 &&
          !config.users?.developers?.includes(interaction.user.id)
        ) {
          await interaction.reply({
            content:
              config.messageSettings.developerMessage !== undefined &&
                config.messageSettings.developerMessage !== null &&
                config.messageSettings.developerMessage !== ""
                ? config.messageSettings.developerMessage
                : "You are not authorized to use this command",
            ephemeral: true,
          });

          return;
        } else if (config.users?.developers?.length <= 0) {
          await interaction.reply({
            content:
              config.messageSettings.missingDevIDsMessage !== undefined &&
                config.messageSettings.missingDevIDsMessage !== null &&
                config.messageSettings.missingDevIDsMessage !== ""
                ? config.messageSettings.missingDevIDsMessage
                : "This is a developer only command, but unable to execute due to missing user IDs in configuration file.",

            ephemeral: true,
          });

          return;
        }
      }

      if (command.options?.nsfw && !interaction.channel.nsfw) {
        await interaction.reply({
          content:
            config.messageSettings.nsfwMessage !== undefined &&
              config.messageSettings.nsfwMessage !== null &&
              config.messageSettings.nsfwMessage !== ""
              ? config.messageSettings.nsfwMessage
              : "The current channel is not a NSFW channel",

          ephemeral: true,
        });

        return;
      }

      if (command.options?.cooldown) {
        const cooldownFunction = async () => {
          let data = cooldown.get(interaction.user.id);

          data.push(interaction.commandName);

          cooldown.set(interaction.user.id, data);

          setTimeout(() => {
            let data = cooldown.get(interaction.user.id);

            data = data.filter((v) => v !== interaction.commandName);

            if (data.length <= 0) {
              cooldown.delete(interaction.user.id);
            } else {
              cooldown.set(interaction.user.id, data);
            }
          }, command.options?.cooldown);
        };

        if (cooldown.has(interaction.user.id)) {
          let data = cooldown.get(interaction.user.id);

          if (data.some((v) => v === interaction.commandName)) {
            await interaction.reply({
              content:
                config.messageSettings.cooldownMessage !== undefined &&
                  config.messageSettings.cooldownMessage !== null &&
                  config.messageSettings.cooldownMessage !== ""
                  ? config.messageSettings.cooldownMessage
                  : "Slow down buddy! You're too fast to use this command",
            });

            return;
          } else {
            cooldownFunction();
          }
        } else {
          cooldown.set(interaction.user.id, [interaction.commandName]);

          cooldownFunction();
        }
      }
      let userdatas = userData.findOne({ id: interaction?.user?.id || interaction?.member?.id })
      if (!userdatas) {
        const saved = new userData({
          id: interaction?.user?.id || interaction?.member?.id
      });
      
      saved.save()
      }
      userdatas = userData.findOne({ id: interaction?.user?.id || interaction?.member?.id })
      if (userdatas.blacklisted == true) {
        interaction.reply({
          content: "You are blacklisted from using the bot."
        })
        return;
      }
      let loginData2 = await mongodb.findOne({ id: interaction?.user?.id || interaction?.member?.id })
      if (command.options?.fortnite == false) {
        command.run(client, interaction, loginData2, mongodb, userdatas);
        return;
      }

      let loginData = await mongodb.findOne({ id: interaction?.user?.id || interaction?.member?.id })
      
      if (!loginData || !loginData.deviceAuths || loginData.deviceAuths.length === 0) {
        loginData = null;
      } else {
        try {
          const selectedDeviceAuth = loginData.deviceAuths.find(deviceAuth => deviceAuth.selectedAccount);
          if (selectedDeviceAuth) {
            let rq = await mcpRequest("QueryProfile", "client", "common_core", {}, selectedDeviceAuth) // test if invalid
            loginData = selectedDeviceAuth // sets the logindata to be the current account
          } else {
            console.log("No deviceAuth with selectedAccount: true found, selecting last account..");
            const noAccountSelected = loginData.deviceAuths.every(account => !account.selectedAccount);

            if (noAccountSelected && loginData.deviceAuths.length > 0) {
              // If no account is selected, and there are saved accounts, select the last one
              const lastAccount = loginData.deviceAuths[loginData.deviceAuths.length - 1];
              lastAccount.selectedAccount = true;
              // Save the updated document
              await loginData.save();

              // Set loginData to the newly selected account
              loginData = lastAccount;
            }
          }
        } catch (err) {
          if (err.response.data.errorCode.includes("errors.com.epicgames.account.invalid_account_credentials")) {
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Login expired.")
                  .setDescription("Sorry, your login expired, Please login again.")
                  .setColor('Red')
                  .setFooter({ "text": err.response.data.errorCode })
              ]
            })
            await mongodb.findOneAndDelete({ id: interaction?.user?.id || interaction?.member?.id });
            return;
          } else if (err.response.data.errorCode.includes("errors.com.epicgames.common.missing_action")) {
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Account is currently banned.")
                  .setDescription("Sorry, this account is currently banned, The account has been deleted from the database.")
                  .setColor('Red')
                  .setFooter({ "text": err.response.data.errorCode })
              ]
            })
            const selectedDeviceAuth11 = loginData.deviceAuths.find(deviceAuth => deviceAuth.selectedAccount);
            const accountIdToDelete = selectedDeviceAuth11.accountId
            mongodb.updateOne(
              { 'deviceAuths.accountId': accountIdToDelete },
              { $pull: { deviceAuths: { accountId: accountIdToDelete } } }
            )
              .then(async (result) => {
                if (result.modifiedCount > 0) {
                  console.log(`DeviceAuth with accountId ${accountIdToDelete} deleted from document`);
                  return;
                } else {
                  console.log(`No document found with accountId ${accountIdToDelete}`);
                }
              })
              .catch((error) => {
                console.error('Error deleting deviceAuth:', error);
              });
          } else {
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("An error occurred.")
                  .setDescription(err.response.data.errorMessage)
                  .setColor('Red')
                  .setFooter({ 'text': err.response.data.errorCode })
                  .setTimestamp()
              ]
            })
            return;
          }
        }
        // if (loginData.deviceAuths.length === 0) {
        //   await mongodb.findOneAndDelete({ id: interaction?.user?.id || interaction?.member?.id });
        //   console.log("Deleted DeviceAuths Log Type: 0")
        //   loginData = null;
        // }
      }

      command.run(client, interaction, loginData, mongodb, userdatas);
    } catch (error) {
      log(error, "err");
      sendErrorLog(`Error while running: ${interaction.commandName}`, e.message, client)
    }
  },
};