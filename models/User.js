const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null, required: true },
    last_name: { type: String, default: null, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String },
    created_at: { type: Date, default: Date.now },
    // todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }]
    //~ Or another option is to link the todo to the user by adding a user_id field to the todo model
});

module.exports = mongoose.model('User', userSchema);