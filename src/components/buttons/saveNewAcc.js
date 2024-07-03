const mongodb = require('../../schemas/UserInfoSchema');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient')
const axios = require("axios");
module.exports = {
    customId: 'save_new_account',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {

        let url = "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token"
        let payload = 'grant_type=client_credentials'
        let headers = {
            'Authorization':
                'basic OThmN2U0MmMyZTNhNGY4NmE3NGViNDNmYmI0MWVkMzk6MGEyNDQ5YTItMDAxYS00NTFlLWFmZWMtM2U4MTI5MDFjNGQ3',
            'Content-Type': 'application/x-www-form-urlencoded'
        }


        const rq = await axios.post(url, payload, { headers: headers })



        const deviceauth = await axios.post("https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/deviceAuthorization", { "prompt": "login" }, { headers: { "Authorization": "bearer " + rq.data.access_token, 'Content-Type': 'application/x-www-form-urlencoded' } })

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
            components: [row],
            ephemeral: true
        });






        let rqstatus = 0;
        let stoped = false;
        let loggedindata;
        let accid, deviceid, secret;
        const devicecode = deviceauth.data.device_code;
        let dupedacc = false;

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
                    const existingDocument = await mongodb.findOne({ id: interaction?.user?.id || interaction?.member?.id });
                    const hasDuplicateAccountId = existingDocument.deviceAuths.some(account => account.accountId === loggedindata.account_id);
                    console.log(`Duplicated Account: ${hasDuplicateAccountId}`);

                    if (hasDuplicateAccountId) {
                        dupedacc = true;
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`Error: Duplicate Account`)
                                    .setDescription(`This account is already saved.`)
                                    .setColor('Red')
                            ],
                            components: []
                        });
                        stoped = true;
                        return;
                    }

                    console.log(response.data)
                    rqstatus = 1;
                    clearInterval(interval);
                    stoped = true;
                    if (!dupedacc) {
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`Logged in as ${loggedindata.displayName}`)
                                    .setDescription(`Your Login has been saved.\nUse /logout to logout of the bot.`)
                                    .setColor('Blue')
                            ],
                            components: [],
                            ephemeral: true
                        });
                    } else {
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`Error: Duplicate Account`)
                                    .setDescription(`This account is already saved.`)
                                    .setColor('Red')
                            ],
                            components: []
                        });
                        stoped = true;
                        return;
                    }

                    axios.post(`https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${response.data.account_id}/deviceAuth`, {}, {
                        headers: {
                            'Authorization': `Bearer ${response.data.access_token}`
                        }
                    })
                        .then(async (deviceauths) => {
                            if (!rqstatus == 1) {
                                return;
                            }
                            accid = deviceauths.data.accountId;
                            deviceid = deviceauths.data.deviceId;
                            secret = deviceauths.data.secret;
                            rqstatus = 2;

                            const userId = interaction?.user?.id || interaction?.member?.id;

                            const existingDocument = await mongodb.findOne({ id: userId });

                            // Set selectedAccount to false for all existing accounts
                            if (existingDocument && existingDocument.deviceAuths) {
                                existingDocument.deviceAuths.forEach((account) => {
                                    account.selectedAccount = false;
                                });

                                // Save the updated existing document
                                await existingDocument.save();
                            }

                            // Create a new document or update the existing one
                            const newAccount = {
                                displayName: loggedindata.displayName ?? "No Name",
                                accountId: accid,
                                deviceId: deviceid,
                                secret: secret,
                                selectedAccount: true
                            };

                            let updatedDocument;

                            if (existingDocument) {
                                // Update the existing document
                                updatedDocument = await mongodb.findOneAndUpdate(
                                    { id: userId },
                                    { $push: { deviceAuths: newAccount } },
                                    { new: true }
                                );
                            } else {
                                // Create a new document
                                updatedDocument = await new mongodb({
                                    id: userId,
                                    deviceAuths: [newAccount],
                                }).save();
                            }

                            console.log('Document updated:', updatedDocument);
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
                                 return;
                             }
                        })
                        .catch((error) => {
                            console.log('Error fetching deviceauths');
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
                console.log('Error executing code');
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