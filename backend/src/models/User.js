const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    rol: { type: String, enum : ['ADMIN', 'CLIENT'], default: 'CLIENT'},
    names: String,
    lastnames: String,
    email: { type: String, unique: true }
})

module.exports = mongoose.model('User', userSchema)