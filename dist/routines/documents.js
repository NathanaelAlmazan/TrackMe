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
exports.sendNotification = void 0;
const web_push_1 = __importDefault(require("web-push"));
const data_client_1 = __importDefault(require("../data-client"));
function sendNotification(officeId, subject, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const officers = yield data_client_1.default.officers.findMany({
            where: {
                officeId: officeId
            }
        });
        const payload = JSON.stringify({
            title: subject,
            body: description,
            icon: 'https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png'
        });
        officers.forEach(officer => {
            if (officer.device)
                web_push_1.default.sendNotification(JSON.parse(officer.device), payload)
                    .catch(err => console.error(err));
        });
    });
}
exports.sendNotification = sendNotification;
//# sourceMappingURL=documents.js.map