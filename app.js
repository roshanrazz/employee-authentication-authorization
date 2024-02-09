const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const employeeRouter = require('./routes/employeeRoute')

require('dotenv').config()

const app = express()

app.listen(process.env.PORT, () => {
    console.log("Server is running...");
})



mongoose.connect(process.env.DB_CONNECTION_URL)

mongoose.connection.on('connected',(msg) =>{
    console.log("Connected to database");
})

mongoose.connection.on('error',(msg) =>{
    console.log("Error occured while connecting with database");
})

app.use(bodyParser.json())

app.use('/api/employees',employeeRouter)

app.use('/',(req,res) =>{
    res.status(404).json({Error: "Bad Request"})
})