const { model, Schema } = require('mongoose');

module.exports = model('UserDataSchema',
    new Schema({
        id: {
            type: String,
            required: true
        },
        premium: {
            type: Boolean,
            required: true,
            default: false
        },
        blacklisted: {
            type: Boolean,
            required: true,
            default: false
        }
    })
);