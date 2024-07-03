token = process.env['token']
mongouri=process.env['mongouri']
module.exports = {
    client: {
        token: token,
        id: "1206312395287564398",
    },
    handler: {
        prefix: "voltex!",
        deploy: true,
        commands: {
            prefix: false,
            slash: true,
            user: false,
            message: false,
        },
        mongodb: {
            uri: mongouri,
            toggle: true,
        },
    },
    users: {
        developers: ["798527554368831528", '1176471394532466738', '1190392802987745350',"1191106521636024320"],
    },
    development: { 
        enabled: false,
        guild: "1190629694207430756",
    }, 
    messageSettings: {
        nsfwMessage: "The current channel is not a NSFW channel.",
        developerMessage: "You are not authorized to use this command.",
        cooldownMessage: "Slow down buddy! You're too fast to use this command.",
        notHasPermissionMessage: "You do not have the permission to use this command.",
        missingDevIDsMessage: "This is a developer only command, but unable to execute due to missing user IDs in configuration file."
    }
};
