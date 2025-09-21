'use strict';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
        user: 'minhtu777n@gmail.com',
        pass: 'abcd1234',
    },
});

const sendMail = async (to, subject, content) => {
    const info = await transporter.sendMail({
        from: '"Minh Tu" <minhtu777n@gmail.com>',
        to,
        subject,
        html: content,
    });
    return info;
};

module.exports = { sendMail };
