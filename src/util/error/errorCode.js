/**
 * Copyright (c) 2016-present www.shengjing360.com
 * Created by Justin on 2016/12/4.
 * Version:V.1.0.0
 * 错误信息包装器，统一错误Code，错误Message格式，提供自定义描述信息
 */
import {systemErrorCode} from "./systemErrorCode";
import {serviceErrorCode} from "./serviceErrorCode";

export function errorMessage(errName, msgData, msgDesc) {

    if (!(this instanceof errorMessage))
        return new errorMessage(errName, msgData, msgDesc);
    var errObj = {};
    if(systemErrorCode[errName]){
        if ('SqlExcuteError' === errName) {
            errObj.code = msgData.errno || systemErrorCode[errName].code;
            errObj.msg = msgData.message || systemErrorCode[errName].msg;
        } else {
            errObj = systemErrorCode[errName];
        }
    }else{
        errObj = serviceErrorCode[errName] || systemErrorCode["SystemError"];
    }
    this.code = errObj.code;
    var msgStr = msgDesc || "";
    this.msg = errObj.msg + " " + msgStr;
    errName === "success" ? this.data = msgData || {} : this.error = (msgData && msgData.stack) || msgData || {};
    errName === "success" ? this.status = 'ok' : this.status = "fail";
}