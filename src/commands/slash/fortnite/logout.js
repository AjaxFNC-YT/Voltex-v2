const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const axios = require("axios");
const components = require('../../../handlers/components');
const config = require('../../../config');
const userInfo = require('../../../schemas/UserInfoSchema');
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('bulk-logout')
        .setDescription('deletes all data from the database.'),
        options: {
            fortnite: false,
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
      };
              console.log(loginData)
              console.log(mongodb)
              let useridd = interaction?.user?.id || interaction?.member?.id
               if (!loginData) {
                 interaction.reply({
                     embeds: [
                         new EmbedBuilder()
                             .setTitle('Login data not found')
                             .setDescription(`You dont have any accounts saved.`)
                             .setColor('Red')
                     ],
                     components: []
                 });
                 return;
               } else {
                 await mongodb.deleteOne({ id: useridd  });
                 interaction.reply({
                      embeds: [
                          new EmbedBuilder()
                              .setTitle('Login data was deleted')
                              .setDescription(`Your Login data has been deleted from the database.`)
                              .setColor('Green')
                      ],
                      components: []
                  });
               }
              

    }
};