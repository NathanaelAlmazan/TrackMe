"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = exports.sendEmail = exports.compileContent = exports.generateSixDigitCode = void 0;
const nodemailer_1 = require("nodemailer");
const auth_1 = require("@vonage/auth");
const server_sdk_1 = require("@vonage/server-sdk");
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ============================== EMAIL ===================================
const transporter = (0, nodemailer_1.createTransport)({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    },
});
function generateSixDigitCode() {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min + '';
}
exports.generateSixDigitCode = generateSixDigitCode;
function compileContent(name, code, message) {
    const filePath = path_1.default.join(__dirname, 'password.hbs');
    const html = fs_1.default.readFileSync(filePath, 'utf-8');
    return handlebars_1.default.compile(html)({ name, code, message });
}
exports.compileContent = compileContent;
function sendEmail(receiver, subject, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: receiver,
            subject: subject,
            html: content
        };
        yield transporter.sendMail(mailOptions);
    });
}
exports.sendEmail = sendEmail;
;
// ============================== SMS ===================================
const vonage = new server_sdk_1.Vonage(new auth_1.Auth({
    apiKey: process.env.SMS_ID,
    apiSecret: process.env.SMS_KEY
}));
function sendSms(recipient, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield vonage.sms.send({
                to: `63${recipient}`,
                from: "Vonage APIs",
                text: message
            });
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.sendSms = sendSms;
;
//# sourceMappingURL=smtp.js.map