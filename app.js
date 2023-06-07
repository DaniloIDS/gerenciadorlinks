require('dotenv').config()
const express = require('express')
const router = require('./routes/linkRouter')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const PORT = process.env.PORT
const linkConnectionDB = process.env.URL_DB
const nameDatabase = process.env.NAME_DB

app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'ejs')
 
app.use(express.static(path.join(__dirname, 'styles')))

app.use('/', router)

app.listen(PORT, ()=>{console.log(`Server running in port ${PORT}`)})

mongoose.connect(linkConnectionDB + nameDatabase)

const db = mongoose.connection

db.on('error', error =>{console.log(`Error while connecting database \n ${error} `)})

db.once('open', ()=>{console.log(`Successfully connected to the database`)})

