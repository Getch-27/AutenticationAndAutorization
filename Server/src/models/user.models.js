const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = new Schema({
    username: { type: 'string', unique: true },
    email: { type: 'string', unique: true },
    profile: { type: 'string', unique: false },
    password: { type: 'string', unique: false },
});

const User = model ('User', userSchema);

module.exports =User;