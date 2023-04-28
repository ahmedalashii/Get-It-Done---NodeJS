const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String },
    // todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }]
});

module.exports = mongoose.model('User', userSchema);