const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required:true, unique: true},
    password:{type: String, required: true},
    phone: {type: Number, required: true},
    wardNo: {type: Number, required: true},
    startYear:{type: Number, required: true},
    endYear:{type: Number, required: true},


},
{timestamps: true})

module.exports =  mongoose.model("MemberDetails",memberSchema)
