import {AppStrings} from "../utils/appStrings";

const User = require('../models/user');
const jwt = require('jsonwebtoken');
import {Request, Response} from "express";
import {RedisHelper} from "../redisHelper";
import commonUtils from "../utils/commonUtils";
import { UserData } from "../utils/enum";
import mongoose from "mongoose";

const bcrypt = require("bcryptjs");
const config = require("config")

const redisClient = RedisHelper.getInstance().getRedisClient()

export class UserController {
    
    public async register(req: Request, res: Response) {
        const user = new User({
            username: req.body.username[UserData.USERNAME.toString()],
            email: req.body.username[UserData.EMAIL.toString()],
            mobile: req.body.username[UserData.MOBILE.toString()],
            password: req.body.password,
            pushToken: req.body.pushToken,
            device: req.body.device
        });

        try {
            // hash password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            await user.save();            

            return commonUtils.sendSuccess(req, res, {data: user}, 201);
        } catch (error) {
            return commonUtils.sendError(req, res, {"error": error}, 409);
        }
    }

    public async login(req: Request, res: Response) {
        const username = req.body.username[UserData.USERNAME.toString()];
        const email = req.body.username[UserData.EMAIL.toString()]; 
        const mobile = req.body.username[UserData.MOBILE.toString()];
        const password = req.body.password
        const pushToken = req.body.pushToken
        const device = req.body.device

        if(!username && !email && !mobile) return commonUtils.sendError(req, res, {message: AppStrings.USERNAME_EMAIL_MOBILE_REQUIRED}, 400);

        try {

            if(username) {
                const user = await User.findOne({username: username}).exec();
                if (user === null) return commonUtils.sendError(req, res, {message: AppStrings.USERNAME_NOT_EXISTS}, 409);
            }else if(email) {
                const user = await User.findOne({email: email}).exec();
                if (user === null) return commonUtils.sendError(req, res, {message: AppStrings.EMAIL_NOT_EXISTS}, 409);
            } else {
                const user = await User.findOne({mobile: mobile}).exec();
                if (user === null) return commonUtils.sendError(req, res, {message: AppStrings.MOBILE_NOT_EXISTS}, 409);
            }

            // use above 

            const valid_password = await bcrypt.compare(password, user.password);
            if (!valid_password) return commonUtils.sendError(req, res, {message: AppStrings.INVALID_PASSWORD}, 409);

            const accessToken = jwt.sign({sub: user._id}, config.get("JWT_ACCESS_SECRET"), {expiresIn: config.get("JWT_ACCESS_TIME")});

            const refreshToken = await generateRefreshToken(user._id)
            return commonUtils.sendSuccess(req, res, {accessToken: accessToken, refreshToken: refreshToken});

        } catch (error) {
            return commonUtils.sendError(req, res, {"error": error}, 409);
        }
    }

    public async checkUnique(req: any, res: Response) {
        const name = UserData.USERNAME.toString();
        const email = UserData.EMAIL.toString();
        const mobile = UserData.MOBILE.toString();
        // encrypt password
        const userdata = new User({
            username: req.body.username[name],
            email: req.body.username[email],
            mobile: req.body.username[mobile]     
        });

        try {
            const user = await User.findOne({username: userdata.username}).exec();
            if (user !== null) return commonUtils.sendError(req, res, {message: AppStrings.USERNAME_EXISTS}, 409);

            const userEmail = await User.findOne({email: userdata.email}).exec();
            if (userEmail !== null) return commonUtils.sendError(req, res, {message: AppStrings.EMAIL_EXISTS}, 409);

            const userMobile = await User.findOne({mobile: userdata.mobile}).exec();
            if (userMobile !== null) return commonUtils.sendError(req, res, {message: AppStrings.MOBILE_EXISTS}, 409);

            return commonUtils.sendSuccess(req, res, {message: AppStrings.USERNAME_NOT_EXISTS});
        } catch (error) {
            return commonUtils.sendError(req, res, {"error": error}, 409);
        }
    }


    public async logout(req: any, res: Response) {
        const user_id = req.userData.sub;
        const token = req.token;

        // remove the refresh token
        await redisClient.del(user_id.toString());

        // blacklist current access token
        await redisClient.set('BL_' + user_id.toString(), token);

        return commonUtils.sendSuccess(req, res, {}, 204);
    }

    public async getAccessToken(req: any, res: Response) {
        const user_id = req.userData.sub;
        const accessToken = jwt.sign({sub: user_id}, config.get("JWT_ACCESS_SECRET"), {expiresIn: config.get("JWT_ACCESS_TIME")});
        const refreshToken = await generateRefreshToken(user_id);
        return commonUtils.sendSuccess(req, res, {accessToken, refreshToken});
    }


    public async methodAllowance(req: any, res: Response) {
        return commonUtils.sendError(req, res, {message: "Request method now allowed."}, 405)
    }
}

export async function generateRefreshToken(user_id: string) {
    const refresh_token = jwt.sign({sub: user_id}, config.get("JWT_REFRESH_SECRET"), {expiresIn: config.get("JWT_REFRESH_TIME")});
    await redisClient.set(user_id.toString(), JSON.stringify({token: refresh_token}));
    return refresh_token;
}
