const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const axios = require("axios");
const components = require('../../../handlers/components');
const config = require('../../../config');
const userInfo = require('../../../schemas/UserInfoSchema');
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('login')
        .setDescription('login using devicecode'),
        options: {
            fortnite: false,
          },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction, loginData, mongodb) => {
        const userId = interaction?.user?.id || interaction?.member?.id;

        if (!config.handler?.mongodb?.toggle) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Database Not Ready')
                        .setDescription('The database is not ready, and this command cannot be executed.')
                        .setColor('Red')
                ],

            });
            return;
        }

        const existingDocument = await mongodb.findOne({ id: userId });

        if (existingDocument && existingDocument.deviceAuths) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Save New Account')
                        .setStyle(ButtonStyle.Success)
                        .setCustomId('save_new_account'),
                    new ButtonBuilder()
                        .setLabel('Switch Account')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('switch_acc')
                );

            const accountsInfo = existingDocument.deviceAuths.map((account, index) => {
                return `${index + 1}. **${account.displayName}** (Account ID: ${account.accountId})`;
            }).join('\n');

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Existing Accounts')
                        .setDescription(`You have ${existingDocument.deviceAuths.length} saved account(s). Here are the details:\n\n${accountsInfo}`)
                        .setColor('Green')
                ],
                ephemeral: true,
                components: [row]
            });

            return;
        }
















      
      let url = "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token"
      let payload = 'grant_type=client_credentials'
      let headers = {
                  'Authorization':
                      'basic OThmN2U0MmMyZTNhNGY4NmE3NGViNDNmYmI0MWVkMzk6MGEyNDQ5YTItMDAxYS00NTFlLWFmZWMtM2U4MTI5MDFjNGQ3',
                  'Content-Type': 'application/x-www-form-urlencoded'
              }


      const rq = await axios.post(url, payload, { headers: headers })



      const deviceauth = await axios.post("https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/deviceAuthorization", {"prompt": "login"}, { headers: {"Authorization": "bearer " + rq.data.access_token, 'Content-Type': 'application/x-www-form-urlencoded'} })

      const confirm = new ButtonBuilder()
          .setLabel('Epic Games')
          .setStyle(ButtonStyle.Link)
          .setDisabled(false)
          .setURL(deviceauth.data.verification_uri_complete);

      const row = new ActionRowBuilder()
          .addComponents(confirm)

      interaction.reply({
          embeds: [
              new EmbedBuilder()
                  .setTitle('📲 Log in to your Epic Games account! ')
                  .setDescription(`**How to login**\n- **Step 1**: Click on the Epic Games button below.\n\n- **Step 2**: Click on the confirm button once the site loads.\n\n- **Step 3**: You are finished!\n\n**Please log into accounts that you own yourself!**\n\n**This embed will timeout in 2 minutes.**`)
                  .setColor('Blue')
          ],
          components: [row]
      });






      let rqstatus = 0;
      let stoped = false;
      let loggedindata;
      let accid, deviceid, secret;
      const devicecode = deviceauth.data.device_code;

      // Set up a timer to run the code every 5 seconds
      const interval = setInterval(async () => {
          try {
              if (stoped) {
                  clearInterval(interval);
                  console.log("Cleared interval");
                  return;
              }

              const response = await axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", {
                  grant_type: 'device_code',
                  device_code: devicecode,
                  token_type: 'eg1'
              }, {
                  headers: {
                      'Authorization': 'Basic OThmN2U0MmMyZTNhNGY4NmE3NGViNDNmYmI0MWVkMzk6MGEyNDQ5YTItMDAxYS00NTFlLWFmZWMtM2U4MTI5MDFjNGQ3',
                      'Content-Type': 'application/x-www-form-urlencoded'
                  }
              });
              loggedindata = response.data
              if (response.status === 200) {
                  console.log(response.data)
                  rqstatus = 1;
                  clearInterval(interval);
                  stoped = true;

                  interaction.editReply({
                      embeds: [
                          new EmbedBuilder()
                              .setTitle(`Success!`)
                              .setDescription(`Saving login <a:loading:1176321244690382939>`)
                              .setColor('Blue')
                      ],
                      components: [],
                      ephemeral: true
                  });

                  axios.post(`https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${response.data.account_id}/deviceAuth`, {}, {
                      headers: {
                          'Authorization': `Bearer ${response.data.access_token}`
                      }
                  })
                      .then((deviceauths) => {
                        if (!rqstatus == 1) {
                          return;
                        }
                        accid = deviceauths.data.accountId;
                        deviceid = deviceauths.data.deviceId;
                        secret = deviceauths.data.secret;
                        rqstatus = 2;

                        savenumber = 0
                        const saved = new userInfo({
                            id: userId,
                            deviceAuths: [
                                {
                                    displayName: loggedindata.displayName ?? "No Name",
                                    accountId: accid,
                                    deviceId: deviceid,
                                    secret: secret,
                                    selectedAccount: true
                                },
                            ],
                        });
                        
                        saved.save()
                            .then((result) => {
                                console.log('Document saved:', result);
                                interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setTitle(`Logged in as ${loggedindata.displayName}`)
                                            .setDescription(`Your login has been saved!`)
                                            .setColor('Green')
                                    ],
                                    components: [],
                                    ephemeral: true
                                });

                            })
                            .catch((error) => {
                                console.error('Error saving document:', error);
                                interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setTitle("Failed to save login")
                                            .setDescription(`There was an issue while saving your login\n\n${error.message}`)
                                    ]
                                })
                            });


                        let rqE = axios.post(`https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/grant_access/${accid}`, {}, {
                      headers: {
                          'Authorization': `Bearer ${response.data.access_token}`
                      }
                  })
                        if (rqE.statusCode === 200) {
                            console.log("Accepted elua")
                        } else if (rqE.data.errorCode === "errors.com.epicgames.bad_request") {
                            console.log("Account already accepted elua")
                        } else {
                            console.log(rqE.data)
                            return;
                        }
                      })
                      .catch((error) => {
                          console.error('Error fetching deviceauths:', error);
                      });
              } else if (response.data.errorCode == "errors.com.epicgames.not_found") {
                interaction.editReply({
                  embeds: [
                      new EmbedBuilder()
                          .setTitle(`Login Canceled.`)
                          .setDescription(`Your Login request was canceled.`)
                          .setColor('Red')
                  ],
                  components: []
                });
                stoped = true;
                return;
              }
          } catch (error) {
              console.error('Error executing code:', error);
          }
      }, 10000); // 10000 milliseconds = 10 seconds

      // Set up a timer to stop the interval after 2 minutes
      const timeout2 = setTimeout(() => {
          if (stoped) {
              return;
          }
          clearInterval(interval);
          console.log('Code execution stopped after 2 minutes');
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Expired`)
                    .setDescription(`Your Login has canceled`)
                    .setColor('Red')
            ],
            components: []
        });
          
          return;
      }, 120000); // 120000 milliseconds = 2 minutes

        
          

      
    }
};