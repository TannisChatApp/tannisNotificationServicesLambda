import * as nodemailer from 'nodemailer'
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as Mail from 'nodemailer/lib/mailer'
import { Transporter } from 'nodemailer'
import { google, Auth } from 'googleapis';
import { Handler } from 'aws-lambda';

export const handler: Handler = async function (event: any): Promise <any> {
    const oauth2Client: Auth.OAuth2Client = new Auth.OAuth2Client(
        (process.env.CLIENT_ID).trim(),
        (process.env.CLIENT_SECRET).trim(),
        "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({ 'refresh_token': (process.env.REFRESH_TOKEN).trim() });
    let smtpTransportOptions: SMTPTransport.Options = {
        'service': "gmail",
        'auth': {
            'type': "OAuth2",
            'user': (process.env.USER_EMAIL).trim(), 
            'clientId': (process.env.CLIENT_ID).trim(),
            'clientSecret': (process.env.CLIENT_SECRET).trim(),
            'refreshToken': (process.env.REFRESH_TOKEN).trim(),
            'accessToken': (process.env.ACCESS_TOKEN).trim()
        },
        'tls': { 'rejectUnauthorized': false }
    }
    const mailOptions: Mail.Options = {
        'from': (process.env.USER_EMAIL).trim(),
        'to': event.mail.sendTo,
        'subject': event.mail.subject,
        'html': event.mail.contentHtml
    };
    const smtpTransport: Transporter = nodemailer.createTransport(smtpTransportOptions);
    let mailerPromiseFunc: any = (resolve: any, reject: any): void => {
        smtpTransport.sendMail(mailOptions, (errMail: Error, mailInfo: any): void => {
            (errMail ? reject(errMail) : resolve(mailInfo));
        });
    }
    await new Promise (mailerPromiseFunc).then((data: any): void => {
        console.log(data);
    }).catch((error: Error): void => {
        console.log(error);
    }).finally((): void => { console.log("This was a promise !!") });
    smtpTransport.close();
};
