"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("../lib/Email");
const Serv_1 = require("mbake/lib/Serv");
const ADB_1 = require("../lib/ADB");
class AdminRoutes extends Serv_1.BasePgRouter {
    constructor(adbDB) {
        super();
        this.emailJs = new Email_1.Email();
        this.adbDB = adbDB;
        this.auth = new ADB_1.AdminAuth(adbDB);
    }
    async checkAdmin(resp, params) {
        let user = Buffer.from(params.admin_email).toString('base64');
        let pswd = Buffer.from(params.admin_pass).toString('base64');
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            this.ret(resp, 'FAIL');
        this.ret(resp, 'OK');
    }
    async getConfig(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        this.ret(resp, this.adbDB.getConfig());
    }
    async updateConfig(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        console.log(params);
        let emailjsService_id = params.emailjsService_id;
        let emailjsTemplate_id = params.emailjsTemplate_id;
        let emailjsUser_id = params.emailjsUser_id;
        let pathToApp = params.pathToApp;
        let port = params.port;
        this.adbDB.updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToApp, port);
        this.ret(resp, 'OK');
    }
    emailResetPasswordCode(resp, params, email, pswd) {
        const config = this.adbDB.getConfig();
        let emailjsService_id = config.emailjsService_id;
        let emailjsTemplate_id = config.emailjsTemplate_id;
        let emailjsUser_id = config.emailjsUser_id;
        let code = this.adbDB.getVcodeAdmin();
        let msg = 'Enter your code at http://bla.bla' + code;
        this.emailJs.send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg);
        this.ret(resp, 'OK');
    }
    async resetPasswordIfMatch(resp, params, email, password) {
        const result = await this.adbDB.resetPasswordAdminIfMatch(email, params.code, params.password);
        this.ret(resp, result);
    }
    async getEditors(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        this.ret(resp, this.adbDB.getEditors());
    }
    async addEditor(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let guid = params.guid;
        let email = params.email;
        let name = params.name;
        let password = params.password;
        await this.adbDB.addEditor(guid, name, email, password);
        this.ret(resp, 'OK');
    }
    async deleteEditor(resp, params, user, pswd) {
        let auth = await this.auth.auth(user, pswd, resp);
        if (auth != 'OK')
            return;
        let guid = params.guid;
        await this.adbDB.deleteEditor(guid);
        this.ret(resp, 'OK');
    }
}
exports.AdminRoutes = AdminRoutes;