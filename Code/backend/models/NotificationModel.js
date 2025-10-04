const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // ... schema fields
});

// CRITICAL: Ensure you are exporting the model correctly
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; // <-- Ensure this line is present and correct