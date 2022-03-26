import {AppConstants} from "../utils/appConstants";

const mongoose_ = require('mongoose');

const userSchema = new mongoose_.Schema({
    username: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        require: false,
        unique: false,
        lowercase: true,
        trim: true, 
    },
    mobile: {
        type: String,
        require: false,
        min: 10,
        max: 10
    },
    password: {
        type: String,
        require: true
    },
    pushToken: {
        type: String,
        require: false
    },
    device: {
        type: String,
        require: false
    },
}, {timestamps: true});

// valueExists function for username, email, mobile number async function
userSchema.statics.valueExists = async function(field: string, value: string) {    
    const user = await this.findOne({[field]: value});
    return user ? true : false;
}

module.exports = mongoose_.model(AppConstants.MODEL_USER, userSchema);