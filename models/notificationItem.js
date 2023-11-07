const mongoose = require("mongoose");

const NotificationIdSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    ntoken: {
        type: String,
        required: true,
        min: 6,
        max: 1000,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("NotificationItem", NotificationIdSchema);
