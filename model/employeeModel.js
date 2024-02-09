const mongoose = require('mongoose')

const Employee = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        required:true,
        unique:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    assigned:{
        default:false,
        type:String
    },
    userType:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("employees",Employee)