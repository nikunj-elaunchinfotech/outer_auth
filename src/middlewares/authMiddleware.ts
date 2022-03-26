import {NextFunction, Request, Response} from "express"
import {RedisHelper} from "../redisHelper";
import {AppStrings} from "../utils/appStrings";
import commonUtils from "../utils/commonUtils";

const config = require("config")
const jwt = require('jsonwebtoken')
const redisClient = RedisHelper.getInstance().getRedisClient()

async function verifyToken(req: any, res: Response, next: Function) {
    try {
        // Bearer token string
        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, config.get("JWT_ACCESS_SECRET"));
        req.userData = decoded;

        req.token = token;

        // varify blacklisted access token.
        let blackListed = await redisClient.get('BL_' + decoded.sub.toString())

        if (blackListed && blackListed === token) {
            return commonUtils.sendError(req, res, {message: AppStrings.BLACKLISTED_TOKEN}, 401);
        } else {
            next();
        }

    } catch (error) {
        return commonUtils.sendError(req, res, {message: AppStrings.INVALID_SESSION}, 401);
    }
}

async function verifyRefreshToken(req: any, res: Response, next: Function) {
    try {
        const token = req.headers.authorization.split(' ')[1];


        if (token === null) return commonUtils.sendError(req, res,{message: AppStrings.INVALID_REQUEST} , 401);
        const decoded = jwt.verify(token, config.get("JWT_REFRESH_SECRET"));
        req.userData = decoded;

        // verify if token is in store or not
        let validate = await redisClient.get(decoded.sub.toString())

        const token_ = JSON.parse(validate ?? "{}");

        if (validate && token_.token == token) {
            next();
        } else {
            return commonUtils.sendError(req, res, {message: AppStrings.UNAUTHORIZED}, 401);
        }
    } catch (error) {
        console.log("LOGGG", error)
        return commonUtils.sendError(req, res, {message: AppStrings.UNAUTHORIZED}, 401);
    }
}

export default {
    verifyToken,
    verifyRefreshToken
}

