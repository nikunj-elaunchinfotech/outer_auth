import {Application} from "express";
import {AppConstants} from "../utils/appConstants";
import {UserController} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import validations from "../middlewares/validations";


export class AuthApiRoutes {

    public userController: UserController = new UserController()

    public routes(app: Application): void {

        // User Auth
        app.post(AppConstants.API_PATH_REGISTER, validations.registerValidation, this.userController.register).all(AppConstants.API_PATH_REGISTER, this.userController.methodAllowance);
        app.post(AppConstants.API_PATH_LOGIN, validations.loginValidation, this.userController.login).all(AppConstants.API_PATH_LOGIN, this.userController.methodAllowance);
        app.get(AppConstants.API_PATH_REFRESH_TOKEN, authMiddleware.verifyRefreshToken, this.userController.getAccessToken).all(AppConstants.API_PATH_REFRESH_TOKEN,this.userController.methodAllowance);
        app.patch(AppConstants.API_PATH_LOGOUT, authMiddleware.verifyToken, this.userController.logout).all(AppConstants.API_PATH_LOGOUT,this.userController.methodAllowance);
    }
}
