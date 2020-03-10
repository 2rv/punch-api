import * as nodemailer from 'nodemailer';
import * as xoauth2 from 'xoauth2';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.NODEMAILER_MAIL,
    pass: process.env.NODEMAILER_PASSWORD,
    clientId:
      '791619938829-95mgdc5sta2h17ot81f55c5a0ot6266m.apps.googleusercontent.com',
    clientSecret: 'K37Qxkl-xPCxuXDRzR0jSCE8',
    refreshToken:
      '1//04iWN4lzzRr6RCgYIARAAGAQSNwF-L9IrcikHgYBcFBhhJIZJAKfruhmC96RKmU_04lXTTJxiUIuN2pHOXCzpuDAJe2H8das4mUw',
    accessToken:
      'ya29.Il_BB-_PR8DJjKVu1OMTnROBkngvwVRYkTL0-ITImyGO_ntlANnamCdvFb6RVjwA5Ayy97xIpBQ0-BEL5GWnjQ-wltwVufnailbG30x2qLqHtblK2qLh5zxoz6AZfv71hA',
    expires: 1484314697598,
  },
});

export interface MailOptionsType {
  subject: string;
  html: string;
  to: string | null;
}

const mailOptions = (data: MailOptionsType) => ({
  from: process.env.NODEMAILER_MAIL,
  ...data,
  to: data.to === null ? process.env.NODEMAILER_MAIL : data.to,
});

export const sendMail = async (options: MailOptionsType, cb) =>
  transporter.sendMail(mailOptions(options), cb);
