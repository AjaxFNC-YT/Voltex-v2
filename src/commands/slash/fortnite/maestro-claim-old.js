const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const userInfo = require('../../../schemas/UserInfoSchema');
const axios = require("axios")
const { getAccessTokenFromDevice } = require('../../../functions');
  module.exports = {
    structure: new SlashCommandBuilder()
      .setName("maestro-claim")
      .setDescription("Claims FNCS rewards.")
      .addStringOption((option) =>
        option
          .setName("jwt")
          .setDescription("The maestro access token.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("questid")
          .setDescription("The questid to claim.")
          .setRequired(false)
      ),
    options: {
      developers: true,
    },
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction<true>} interaction
     */
    run: async (client, interaction, loginData, mongodb) => {

      if (!config.handler?.mongodb?.toggle) {
        await message.editReply({
            content: 'Database is not ready; this command cannot be executed.'
        });

        return;
    }

    let userId = interaction?.user?.id || interaction?.member?.id;
    if (!config.handler?.mongodb?.toggle) {
        await message.editReply({
            content: 'Database is not ready, this command cannot be executed.'
        });

        return;
    };
            let useridd = interaction?.user?.id || interaction?.member?.id



              const id = interaction.options?.getString('questid')
              if (!id) {
               const ids = ['652469f1987b7a00a7d7b370', '652468f578312a00a7d53104', '652466fc987b7a00a7d7b36f', '6524642078312a00a7d53103', '652428c878312a00a7d530ff', '65242652987b7a00a7d7b36d', '6524252a78312a00a7d530fe', '652423bb78312a00a7d530fd', '64dfba3c4103a600a73b83d5', '64dfb8304103a600a73b83d4', '64df9747622b3100a73ba308', '64d5629146dfa600a789b5f3', '64d561108d8e2300a7ed1a66', '64d55ff446dfa600a789b5f2', '64d55d3a46dfa600a789b5f1', '64d55a1e8d8e2300a7ed1a64', '64cd46b8296f2a00a6064a65', '64cd4617296f2a00a6064a64', '64cd44b1296f2a00a6064a63', '64c3878dc8602f00a708568c', '64c1a86dbb960300a7deb10d', '64c1a6d5bb960300a7deb10c', '64c05346ce5cba00a747c8aa', '64c05318ce5cba00a747c8a9', '64c052ccce5cba00a747c8a8', '64c05246ce5cba00a747c8a7', '64b84cfe26c18b00a7609956', '649489d0217eb400a791798e', '619615104a85b300a674c500', '6196143315884600a6018cb0', '619613b00fd86f00a7b3901c', '619613389597e300a686f6b7', '619612ae15884600a6018caf', '619611c52bbec800a6aa1eb7', '618ecb3205a58c00a6b3714d', '618ec3e67918c900a6ea58a7', '617dcb5f6bf25a00a79b2182', '6179b781f8164300a7282ba1', '61799fe1f4e58300a62b3a43', '61799cda6ebec800a60aa79d', '61799c356ebec800a60aa79c', '61799bdff4e58300a62b3a42', '61799a2f2a122700a6615ba8', '6176dbcc3894f900a6c8c58b', '6167423920262500a69a4b42', '61673d624c1cb000a75a35b3', '616736e14c1cb000a75a35b2', '613287afdaa5da00a783841e', '6131106d06f8ea00a7e5f699', '6127d5ec31d8fa00a782a7b3', '6126a16616413200a5d686fb', '6126989216413200a5d686fa'];
                 let maestroAccessToken;
                 //let access_tkk = await getAccessTokenFromDevice(loginData.accountId, loginData.deviceId, loginData.secret);

                 try {
                   
                   interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Claiming')
                                .setDescription(`ETA: Calculating <a:loading:1176321244690382939>`)
                                .setColor('Blue')
                        ],
                        components: []
                    });
                  
                  maestroAccessToken = interaction.options?.getString('jwt');
                  let slided =maestroAccessToken.slice(0, 2)
                  if (!slided == "ey") {
                    await interaction.deferReply()
                    interaction.editReply({
                      embeds: [
                        new EmbedBuilder()
                          .setTitle("Error")
                          .setDescription("Invalid JWT provided.")
                          .setTimestamp()
                          .setColor("Red")
                      ]
                    })
                    return;
                  }
                  if (maestroAccessToken.length < 500) {
                    await interaction.deferReply()
                    interaction.editReply({
                      embeds: [
                        new EmbedBuilder()
                          .setTitle("Error")
                          .setDescription("Invalid JWT provided.")
                          .setTimestamp()
                          .setColor("Red")
                      ]
                    })
                    return;
                  }
                  maestroAccessToken = maestroAccessToken.replace(" ", "")
                  maestroAccessToken = maestroAccessToken.replace("Bearer", "")
                    const body2 = {
                         "blob": {
                             "d_ct": 1691262454762,
                             "d_nd": false,
                             "d_np": "Win32",
                             "d_pid": "443e819e-ef4e-48b3-8581-f7ff650b0c4d",
                             "d_sh": 1080,
                             "d_sw": 1920,
                             "d_tid": "58105193-3847-4b78-898a-2b9588f9e952",
                             "d_ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
                             "i_id": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7Il9pZCI6IjVkNjVhZWYwYTY0ZGI4MDBhNTBiZDZmMCIsImNyZWF0ZWQiOjE1Njg4NTY5NzguNDcxLCJzbHVnIjoiZm9ydG5pdGUtc3RhZ2luZzIiLCJ1aWQiOiJzaXRlX3Rva2VuIn0sImlhdCI6MTU2ODg1Njk3OH0.HvNBpvoK4dI5i7GmI4A4LCMCOyR8r1HIEwRqOmgA_j0",
                             "m_iv": "1.00.0",
                             "p_c": "pages",
                             "p_id": "5d65aef0a64db800a50bd5ca",
                             "p_n": "EN",
                             "p_s": "home",
                             "p_t": "channel",
                             "r_d": "t.co",
                             "r_u": "https://t.co/",
                             "se_id": "36fa5f81-fe64-40c0-aa79-148ea833a953",
                             "se_s": 1691861378752,
                             "si_d": "competitive.fortnite.com",
                             "si_id": "5d65aef0a64db800a50bd6f0",
                             "si_pid": "maestro-sapphire",
                             "si_pv": "4.06.0-sapphire",
                             "si_s": "fortnite-staging2",
                             "u_a": "https://static.gcp.maestro.io/media/552ef679e3d499087b0ea28b/57a5227bf3dc24143b67aa31.jpg",
                             "u_c": 1691262477068,
                             "u_id": "64ce9e0d1bfe2d00a7ba01d8",
                             "u_li": true,
                             "u_n": "",
                             "u_nu": false,
                             "u_s": "epic",
                             "u_u": "epic-",
                             "u_un": "",
                             "d_tim": 1691861644799,
                             "d_tof": 952,
                             "e_t": 1691861645751,
                             "e_u": "https://competitive.fortnite.com/home",
                             "e0": "quest",
                             "e3": "64d55a1e8d8e2300a7ed1a64",
                             "e4": "Emoticon - S25 FNCS Drops - EN",
                             "t": 1691861645751
                         }
                     }

                   const headers2 = {
                     "Accept": "application/json, text/plain, /",
                       "Content-Type": "application/json;charset=UTF-8",
                       "Dnt": "1",
                       "Referer": "https://competitive.fortnite.com/",
                       "Sec-Ch-Ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                       "Sec-Ch-Ua-Mobile": "?0",
                       "Sec-Ch-Ua-Platform": "\"Windows\"",
                       "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
                       "Authorization": `Bearer ${maestroAccessToken}`
                   }

                   const startTime = Date.now();

                   for (let i = 0; i < ids.length; i++) {
                     const user = interaction.member?.id || interaction.user.id;
                     await axios.post(`https://us-central1-firebase-lessthan3.cloudfunctions.net/quests/v3/${ids[i]}/claim`, body2, { headers: headers2 })
                       .then((response) => {
                         
                       })
                       .catch((error) => {
                         //console.error("Error:", error);
                       });

                     const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
                     const totalItems = ids.length;
                     const itemsCompleted = i + 1;
                     const remainingItems = totalItems - itemsCompleted;
                     let estimatedTime = (elapsedTime / itemsCompleted) * remainingItems;

                     // Convert to minutes if ETA is at least 60 seconds
                     if (estimatedTime >= 60) {
                       estimatedTime = estimatedTime / 60; // convert seconds to minutes
                     }

                     // Update message with ETA
                     interaction.editReply({
                         embeds: [
                             new EmbedBuilder()
                                 .setTitle('Claiming <a:loading:1176321244690382939>')
                                 .setDescription(`ETA: ${Math.round(estimatedTime)} ${estimatedTime >= 60 ? 'seconds' : 'minutes'} remaining`)
                                 .setColor('Green')
                         ],
                         components: []
                     });
                   }
                 } catch (error) {
                   //console.error('Error (bottom):', error.message);
                   //console.log(error)
                 }
              } else {

                 try {
                   
                   interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Claiming')
                                .setDescription(`ETA: Calculating (custom id) <a:loading:1176321244690382939>`)
                                .setColor('Blue')
                        ],
                        components: []
                    });
                   maestroAccessToken = interaction?.options?.getString("jwt");

                    const body2 = {
                         "blob": {
                             "d_ct": 1691262454762,
                             "d_nd": false,
                             "d_np": "Win32",
                             "d_pid": "443e819e-ef4e-48b3-8581-f7ff650b0c4d",
                             "d_sh": 1080,
                             "d_sw": 1920,
                             "d_tid": "58105193-3847-4b78-898a-2b9588f9e952",
                             "d_ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
                             "i_id": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7Il9pZCI6IjVkNjVhZWYwYTY0ZGI4MDBhNTBiZDZmMCIsImNyZWF0ZWQiOjE1Njg4NTY5NzguNDcxLCJzbHVnIjoiZm9ydG5pdGUtc3RhZ2luZzIiLCJ1aWQiOiJzaXRlX3Rva2VuIn0sImlhdCI6MTU2ODg1Njk3OH0.HvNBpvoK4dI5i7GmI4A4LCMCOyR8r1HIEwRqOmgA_j0",
                             "m_iv": "1.00.0",
                             "p_c": "pages",
                             "p_id": "5d65aef0a64db800a50bd5ca",
                             "p_n": "EN",
                             "p_s": "home",
                             "p_t": "channel",
                             "r_d": "t.co",
                             "r_u": "https://t.co/",
                             "se_id": "36fa5f81-fe64-40c0-aa79-148ea833a953",
                             "se_s": 1691861378752,
                             "si_d": "competitive.fortnite.com",
                             "si_id": "5d65aef0a64db800a50bd6f0",
                             "si_pid": "maestro-sapphire",
                             "si_pv": "4.06.0-sapphire",
                             "si_s": "fortnite-staging2",
                             "u_a": "https://static.gcp.maestro.io/media/552ef679e3d499087b0ea28b/57a5227bf3dc24143b67aa31.jpg",
                             "u_c": 1691262477068,
                             "u_id": "64ce9e0d1bfe2d00a7ba01d8",
                             "u_li": true,
                             "u_n": "",
                             "u_nu": false,
                             "u_s": "epic",
                             "u_u": "epic-",
                             "u_un": "",
                             "d_tim": 1691861644799,
                             "d_tof": 952,
                             "e_t": 1691861645751,
                             "e_u": "https://competitive.fortnite.com/home",
                             "e0": "quest",
                             "e3": "64d55a1e8d8e2300a7ed1a64",
                             "e4": "Emoticon - S25 FNCS Drops - EN",
                             "t": 1691861645751
                         }
                     }

                   const headers2 = {
                     "Accept": "application/json, text/plain, /",
                       "Content-Type": "application/json;charset=UTF-8",
                       "Dnt": "1",
                       "Referer": "https://competitive.fortnite.com/",
                       "Sec-Ch-Ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                       "Sec-Ch-Ua-Mobile": "?0",
                       "Sec-Ch-Ua-Platform": "\"Windows\"",
                       "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
                       "Authorization": `Bearer ${maestroAccessToken}`
                   }

                   const startTime = Date.now();
                     const user = interaction.member?.id || interaction.user.id;
                     await axios.post(`https://us-central1-firebase-lessthan3.cloudfunctions.net/quests/v3/${id}/claim`, body2, { headers: headers2 })
                       .then((response) => {
                       })
                       .catch((error) => {
                         //console.error("Error:", error);
                       });

                     const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
                     const totalItems = id.length;
                     const itemsCompleted = 1
                     const remainingItems = totalItems - itemsCompleted;
                     let estimatedTime = (elapsedTime / itemsCompleted) * remainingItems;

                     // Convert to minutes if ETA is at least 60 seconds
                     if (estimatedTime >= 60) {
                       estimatedTime = estimatedTime / 60; // convert seconds to minutes
                     }

                     // Update message with ETA
                     interaction.editReply({
                         embeds: [
                             new EmbedBuilder()
                                 .setTitle('Claiming <a:loading:1176321244690382939>')
                                 .setDescription(`ETA: ${Math.round(estimatedTime)} ${estimatedTime >= 60 ? 'seconds' : 'minutes'} remaining`)
                                 .setColor('Green')
                         ],
                         components: []
                     });
                   
                 } catch (error) {
                   //console.error('Error (bottom):', error.message);
                   //console.log(error)
                 }
              }

                 const successMsg = "Claimed all available Twitch drops.";

               interaction.editReply({
                   embeds: [
                       new EmbedBuilder()
                           .setTitle('Twitch Drop Claim Status')
                           .setDescription(`Claimed all available Twitch drops.`)
                           .setColor('Green')
                   ],
                   components: []
               });
    },
  }; 