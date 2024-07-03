const chalk = require("chalk");
const axios = require("axios");
const mongodb = require("./schemas/UserInfoSchema");
const ExtendedClient = require("../src/class/ExtendedClient");
const { EmbedBuilder } = require("discord.js");
/**
 * Logs a message with optional styling.
 *
 * @param {string} string - The message to log.
 * @param {'info' | 'err' | 'warn' | 'done' | undefined} style - The style of the log.
 */
const log = (string, style) => {
  const styles = {
    info: { prefix: chalk.blue("[INFO]"), logFunction: console.log },
    err: { prefix: chalk.red("[ERROR]"), logFunction: console.error },
    warn: { prefix: chalk.yellow("[WARNING]"), logFunction: console.warn },
    done: { prefix: chalk.green("[SUCCESS]"), logFunction: console.log },
  };

  const selectedStyle = styles[style] || { logFunction: console.log };
  selectedStyle.logFunction(`${selectedStyle.prefix || ""} ${string}`);
};

/**
 * Formats a timestamp.
 *
 * @param {number} time - The timestamp in milliseconds.
 * @param {import('discord.js').TimestampStylesString} style - The timestamp style.
 * @returns {string} - The formatted timestamp.
 */
const time = (time, style) => {
  return `<t:${Math.floor(time / 1000)}${style ? `:${style}` : ""}>`;
};


/**
 * generates a access token using device auths
 *
 * @param {accountid} string - The account id
 * @param {deviceid} string - The device id
 * @param {secret} string - The secret
 * @returns {JSON} - The json of the request
 */
const getAccessTokenFromDevice = async (accountId, deviceId, secret) => {
  const response = await axios.post(
    "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token",
    {
      grant_type: 'device_auth',
      account_id: accountId,
      device_id: deviceId,
      secret: secret,
      token_type: 'eg1'
    },
    {
      headers: {
        'Authorization': 'Basic OThmN2U0MmMyZTNhNGY4NmE3NGViNDNmYmI0MWVkMzk6MGEyNDQ5YTItMDAxYS00NTFlLWFmZWMtM2U4MTI5MDFjNGQ3',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data.access_token;
};

/**
 * does a mcp request
 *
 * @returns {JSON} - The formatted timestamp.
 */
const mcpRequest = async (operation, route, profile, payload, loginData) => {
  let loginDataa = loginData;
  let accid=loginDataa.accountId;
  let deviceidd=loginDataa.deviceId;
  let secrett=loginDataa.secret;
  let accesstoken = await getAccessTokenFromDevice(accid, deviceidd, secrett);

  let rq = await axios.post(`https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${accid}/${route}/${operation}?profileId=${profile}`, payload, { headers: { "Authorization": `Bearer ${accesstoken}` } });
  return rq.data;
}


/**
 * Gets a Exchange code from a access token
 *
 * @param {access_token} string - the access token
 * @param {LoginData} JSON - the loginData for the user
 * @returns {JSON} - The formatted timestamp.
 */
const getExchangeFromAccess = async (access_token, loginData) => {
    try {
    headers = {
        'Authorization': `Bearer ${access_token}`
    }
    const rq = await axios.get("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/exchange", { headers })
    return { status: 200, code: rq.data.code }
} catch (e) {
    return { status: 401, error: e.message };
}
}

async function findDeviceAuthByAccountId(accountId) {
  try {
      const document = await mongodb.findOne({ 'deviceAuths.accountId': accountId });

      if (document && document.deviceAuths) {
          const deviceAuth = document.deviceAuths.find(account => account.accountId === accountId);
          return deviceAuth;
      } else {
          console.log('No document found or no deviceAuths array.');
          return null;
      }
  } catch (error) {
      console.error('Error finding deviceAuth:', error);
      return null;
  }
}

async function favoritePlaylist(playlistId, loginData) {
  try {
    const accesstkk = await getAccessTokenFromDevice(loginData.AccountId, loginData.deviceid, loginData.secret);
    const rq = axios.post(`https://fn-service-discovery-live-public.ogs.live.on.epicgames.com/api/v1/links/favorites/${loginData.accountId}/${playlistId}`, {}, { headers: { "Authorization": `Bearer ${accesstkk}` } });
    return { "error": false, errorMsg: null, rqData: rq.data }
  } catch (e) {
    return { "error": true, errorMsg: e.message, rqData: null }
  }
}

/**
   *
   * @param {ExtendedClient} client
   * @param {import('discord.js').Interaction} interaction
   * @returns
   */
async function sendErrorLog(title, error, client) {
  try {
    const embed = new EmbedBuilder().setTitle(title).setDescription(error).setColor("Red").setTimestamp()
    let channel = await client.channels.cache.get("1132220507090075668");
    await channel.send({ embeds: [embed] });
    return { sent: true, error: null }
  } catch (e) {
    return { sent: false, error: e }
  }
}

module.exports = {
  log,
  time,
  getAccessTokenFromDevice,
  mcpRequest,
  getExchangeFromAccess,
  findDeviceAuthByAccountId,
  favoritePlaylist,
  sendErrorLog
};