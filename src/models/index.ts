const mongoose = require('mongoose');
import {AppConstants} from "../utils/appConstants";

mongoose.Promise = global.Promise;

const db: {[k: string]: any} = {};

db.mongoose = mongoose;
db[AppConstants.MODEL_USER] = require("./user");

module.exports = db;