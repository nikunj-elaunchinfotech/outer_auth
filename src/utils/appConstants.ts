export class AppConstants {

    public static readonly API_ROUTE_SOCKET = "/api"


    public static readonly API_PATH_REGISTER = AppConstants.API_ROUTE_SOCKET + "/register"
    public static readonly API_PATH_LOGIN = AppConstants.API_ROUTE_SOCKET + "/login"
    public static readonly API_PATH_LOGOUT = AppConstants.API_ROUTE_SOCKET + "/logout"
    public static readonly API_PATH_REFRESH_TOKEN = AppConstants.API_ROUTE_SOCKET + "/refreshToken"

    public static readonly MODEL_USER = 'User'


    public static readonly DATE_FORMAT: string = "yyyy-MM-DD HH:mm:ss.SSS";
    public static readonly DATE_FORMAT_SHORT: string = "yyyy-MM-DD HH:mm:ss";

}

declare global {
    interface String {
        isExists(): boolean;

        isEmpty(): boolean;
    }

    interface Number {
        isExists(): boolean;
    }

    interface Boolean {
        isExists(): boolean;
    }


}

String.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}
String.prototype.isEmpty = function () {
    return (this) == "";
}

Number.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}

Boolean.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}
