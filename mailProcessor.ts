import * as nodemailer from 'nodemailer'
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as Mail from 'nodemailer/lib/mailer'
import { Transporter } from 'nodemailer'
import { Handler } from 'aws-lambda';

export const handler: Handler = async function (event: any): Promise <any> {
    console.log("Input event object !!"); console.log(event);
    let result: any = null;
    const smtpTransportOptions: SMTPTransport.Options = {
        'service': "gmail",
        'auth': {
            'type': "OAuth2",
            'user': (process.env.USER_EMAIL).trim(), 
            'clientId': (process.env.CLIENT_ID).trim(),
            'clientSecret': (process.env.CLIENT_SECRET).trim(),
            'refreshToken': (process.env.REFRESH_TOKEN).trim()
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
    await new Promise ((resolve: any, reject: any): void => {
        smtpTransport.sendMail(mailOptions, (errMail: Error, mailInfo: any): void => {
            (errMail ? reject(errMail) : resolve(mailInfo));
        });
    }).then((data: any): void => {
        console.log("Mailing promise resolved !!"); console.log(data);
        result = data;
    }).catch((error: Error): void => {
        console.log("Mailing promise rejected !!"); console.log(error);
        result = error;
    }).finally((): void => { console.log("This was a promise !!") });
    smtpTransport.close();
    return (result);
};
