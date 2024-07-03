const { model, Schema } = require('mongoose');

module.exports = model('userInfo',
    new Schema({
        id: {
            type: String,
            required: true
        },
        deviceAuths: [
            {
                accountId: {
                    type: String,
                    required: true
                },
                deviceId: {
                    type: String,
                    required: true
                },
                secret: {
                    type: String,
                    required: true
                },
                displayName: {
                    type: String,
                    required: true
                },
                selectedAccount: {
                    type: Boolean,
                    required: true,
                    default: true
                }
            }
        ],
    })
);
