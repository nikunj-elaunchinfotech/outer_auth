import {NextFunction, Request, Response} from "express"
import validator from "../utils/validate";
import commonUtils from "../utils/commonUtils";
import {UserData} from "../utils/enum";


async function loginValidation(req: Request, res: Response, next: NextFunction) {
    const username = UserData.USERNAME.toString();
    const email = UserData.EMAIL.toString();
    const mobile = UserData.MOBILE.toString();

    const validationRule = {
        "username": "required",
        "password": "required|min:4|max:50",
    }

    validator.validatorUtil(req.body, validationRule, {}, (err: any, status: boolean) => {
        if (!status) {
            console.log("ERRORS :", err)

            return commonUtils.sendError(req, res, {
                errors: commonUtils.formattedErrors(err)
            });
        } else {
            next();
        }
    });

}

async function registerValidation(req: Request, res: Response, next: NextFunction) {
    const username = UserData.USERNAME.toString();
    const email = UserData.EMAIL.toString();
    const mobile = UserData.MOBILE.toString();

    const validationRule = {
        "username":{
            [username]: "required|string|min:3|max:255|exist:User,username",
            [email]: "required|string|email|max:255|exist:User,email",
            [mobile]: "required|string|min:10",
        },
        "password": "required|min:4|max:50",
    }    
    
    validator.validatorUtil(req.body, validationRule, {}, (err: any, status: boolean) => {
        if (!status) {
            console.log("ERRORS :", err)

            return commonUtils.sendError(req, res, {
                errors: commonUtils.formattedErrors(err)
            });
        } else {
            next();
        }
    });

}

async function verifyOTPValidation(req: Request, res: Response, next: NextFunction) {

    const validationRule = {
        "mobileNumber": "required|string",
        "countryCode": "required|string",
        "otp": "required|size:4",
        "type": "required",
        "deviceId": "required|string",
        "deviceType": "required",
        "deviceToken": "required|string",
    }

    validator.validatorUtil(req.body, validationRule, {}, (err: any, status: boolean) => {
        if (!status) {
            console.log("ERRORS :", err)

            return commonUtils.sendError(req, res, {
                errors: commonUtils.formattedErrors(err)
            });
        } else {
            next();
        }
    });

}


export default {
    loginValidation,
    registerValidation,
}

