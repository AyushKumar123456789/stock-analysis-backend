const nodeMailer = require('nodemailer');

const emailVerificationRedirect =
    process.env.CLIENT_URL || 'http://localhost:5173';

module.exports.SignInMail = async (obj) => {
    try {
        const output = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h1 style="color: #4CAF50;">Login Link</h1>
                <ul style="list-style-type: none; padding: 0;">
                    <li><strong>Name:</strong> ${obj.username}</li>
                    <li><strong>Email:</strong> ${obj.email}</li>
                    <li><strong>Company:</strong> Stock Analysis</li>
                </ul>
                <p>Please click the button below to log in:</p>
                <a href="${emailVerificationRedirect}/backend-redirect?token=${obj.token}" 
                   style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                   Login
                </a>
                <p>If you did not request this login, please ignore this email.</p>
                <p>Thank you,<br>Stock Analysis Team</p>
            </div>
        `;

        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        let mailOptions = {
            from: `"Stock Analysis" <${process.env.EMAIL_USER}>`,
            to: obj.email,
            subject: 'Login Link - Stock Analysis',
            text: `Dear ${obj.username},\n\nPlease log in by clicking the link below:\n${emailVerificationRedirect}/backend-redirect?token=${obj.token}\n\nThank you,\nStock Analysis Team`,
            html: output,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error in Nodemailer:', error);
                throw new Error('Error in sending email');
            }
            console.log(`Message sent: ${info.messageId}`);
        });
    } catch (err) {
        console.error('Error in sending email:', err);
        throw new Error('Error in sending email');
    }
};
