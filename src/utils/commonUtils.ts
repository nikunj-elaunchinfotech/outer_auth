import {AppConstants} from "./appConstants";
import moment from "moment";
import {Request, Response} from "express";
import encryptedData from "../middlewares/secure/encryptData";

const config = require("config")
const path = require('path')
const os = require('os')
const md5 = require("md5");

const getRootDir = () => path.parse(process.cwd()).root
const getHomeDir = () => os.homedir()
const getPubDir = () => "./public"


function formatDate(date: any) {
    return moment(date).format(AppConstants.DATE_FORMAT)
}

async function sendSuccess(req: Request, res: Response, data: any, statusCode = 200) {
    console.log("DATA : ", data)
    if (req.headers.env === "test") {
        return res.status(statusCode).send(data)
    }

    let encData = await encryptedData.EncryptedData(req, res, data)
    return res.status(statusCode).send(encData)
}

async function sendError(req: Request, res: Response, data: any, statusCode = 422) {
    return res.status(statusCode).send(data)
}

function getCurrentUTC(format = AppConstants.DATE_FORMAT, addMonth: any = null, addSeconds: number = 0) {
    // console.log(moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    if (addMonth != null) {
        return moment.utc(new Date()).add(addMonth, 'M').format(format);
    } else if (addSeconds > 0) {
        return moment.utc(new Date()).add(addSeconds, 'seconds').format(format);
    } else {
        return moment.utc(new Date()).add().format(format);
    }
}

function formattedErrors(err: any) {
    let transformed: any = {};
    Object.keys(err).forEach(function (key, val) {
        transformed[key] = err[key][0];
    })
    return transformed
}


export default {
    getCurrentUTC,
    sendSuccess,
    sendError,
    formattedErrors,
    getRootDir,
    getHomeDir,
    getPubDir,
    formatDate
}
