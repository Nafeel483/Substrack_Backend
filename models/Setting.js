const mongoose = require('mongoose');

const settingSechema = new mongoose.Schema(
    {
        userId: {
            type: String,
        },
        themeColor: {
            type: String,
        },
        displayAnthem: {
            type: Boolean,
            default: false
        },
        displayTop10: {
            type: Boolean,
            default: false
        },
        displayWallComments: {
            type: Boolean,
            default: false
        },
        showOnline: {
            type: Boolean,
            default: false
        },
        privateProfile: {
            type: Boolean,
            default: false
        },
        hideProfileSearch: {
            type: Boolean,
            default: false
        },
        hideAge: {
            type: Boolean,
            default: false
        },
        messageAudience: {
            type: String,
            enum: ['Everyone', 'Friends', 'No'],
            default: 'Everyone'
        },
        messageRestrication: {
            type: Boolean,
            default: false
        },
        bulletinComment: {
            type: Boolean,
            default: false
        },
        photoComment: {
            type: Boolean,
            default: false
        },
        wallComment: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

const Setting = mongoose.model('Setting', settingSechema);

module.exports = Setting;
