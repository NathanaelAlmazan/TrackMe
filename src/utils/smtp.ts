import { createTransport } from 'nodemailer';
import { Auth } from '@vonage/auth';
import { Vonage } from '@vonage/server-sdk';
import hbs from 'handlebars';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config()

// ============================== EMAIL ===================================

const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    },
});

export function generateSixDigitCode() {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min + '';
}

export function compileContent(name: string, code: string, message: string) {
    const filePath = path.join(__dirname, 'password.hbs');
    const html = fs.readFileSync(filePath, 'utf-8');

    return hbs.compile(html)({ name, code, message });
}

export async function sendEmail(receiver: string, subject: string, content: string) {
    const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: receiver,
            subject: subject,
            html: content
    };

    await transporter.sendMail(mailOptions);
};

// ============================== SMS ===================================

const vonage = new Vonage(new Auth({
    apiKey: process.env.SMS_ID,
    apiSecret: process.env.SMS_KEY
}));

export async function sendSms(recipient: string, message: string) {
    try {
        await vonage.sms.send({
            to: `63${recipient}`,
            from: "Vonage APIs",
            text: message
        })
    } catch(err) {
        console.error(err);
    }
};

