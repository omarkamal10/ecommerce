const mongoose = require('mongoose')

//User Schema
const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    admin: {
        type: Number
    }
})

const User = mongoose.model('User',userSchema);

module.exports = User;