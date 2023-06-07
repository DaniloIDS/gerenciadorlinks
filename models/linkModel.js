const mongoose = require('mongoose')

const linkSchema = mongoose.Schema({
    titulo: {type: String, required: true},
    url: {type: String, required: true},
    click: {type: Number, default: 0} 
})

module.exports = linkSchema