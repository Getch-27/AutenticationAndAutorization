const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = new Schema({
    username : {type : 'string', unieue : true},
    email:{type : 'string', unieue :true},
    password : {type : 'string', unieue : false}
})

const User = model ('User', userSchema);

module.exports =User;