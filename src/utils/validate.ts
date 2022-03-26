import {Request} from "express";
const Models = require("../models");

const Validator = require('validatorjs');
const validatorUtil = (body: any, rules: any, customMessages: any, callback: Function) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors.errors, false));
};

Validator.register('minmax_player', (value: any) => value >= 2 && value <= 9,
    'noOfPlayers is not valid.!')

Validator.registerAsync('maxLen', function (status: any, attribute: any, req: Request, passes: any) {
    if (status.toString().length <= 50) {
        passes();
    } else {
        passes(false, '50 characters max.');
    }
});

export default {
    validatorUtil
}

Validator.registerAsync('exist', function(value:any,  attribute:any, req:Request, passes:any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    
    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;

    
    let msg = (column == "username") ? `${column} has already been taken `: `${column} already in use`
    
    Models[table].valueExists(column, value).then((result:any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err:any) => {
        passes(false, err);
    });
});
