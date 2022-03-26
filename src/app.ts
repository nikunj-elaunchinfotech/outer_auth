import {AuthApiRoutes} from "./routers/authApiRouter";
import decryptedData from "./middlewares/secure/decryptData";

const express = require('express')

const bodyParser = require('body-parser')

// const expressJwt = require('express-jwt');

class App {

    public app = express();
    public authApiRoutes: AuthApiRoutes = new AuthApiRoutes();

    constructor() {
        this.config();
        this.authApiRoutes.routes(this.app);
    }

    private config(): void {
        this.app.use(bodyParser.json({limit: '50mb'}))
        this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
        this.app.use(express.static('public'))
        this.app.use(decryptedData.DecryptedData)
        /*this.app.use(expressJwt({
            secret: Buffer.from(AppConstants.ACCESS_TOKEN_SECRET, 'base64'),
            algorithms: ['HS256'],
            requestProperty: 'body.user',
            getToken: function fromHeaderOrQuerystring(req: Request) {
                const authHeader = req.headers.authorization
                if (authHeader) {
                    const parts = authHeader.split(' ')
                    return parts.length > 1 ? parts[1] : null
                }
                return null
            }
        }).unless(({
            path: [
                AppConstants.API_PATH_LOGIN,
                AppConstants.API_PATH_VERIFY_OTP,
                AppConstants.API_PATH_RESEND_OTP,
                AppConstants.API_PATH_COMMON_SETTINGS,
                AppConstants.API_PATH_UPLOAD_IMAGE,
                AppConstants.API_PATH_UPLOAD_GROUP_IMAGE,
                AppConstants.API_PATH_UPLOAD_MEDIA,
                AppConstants.API_STORAGE,
                AppConstants.API_PRIVACY_POLICY,
                AppConstants.API_DISCLAIMER,
                AppConstants.API_COPYRIGHT_POLICY,
                AppConstants.API_TERMS_CONDITIONS,
            ]
        })))

        this.app.use(async function (err: any, req: Request, res: Response, next: NextFunction) {
            if (err.name === 'UnauthorizedError') {

                console.log("JWT_RES: ", err, " ", req.url, " ", req.headers.authorization)

                return res.status(401).send(JSON.stringify({"message": "Full authentication is required to access this resource"}))
            }
            next()
        })*/

    }


}

export default new App().app;
