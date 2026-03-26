const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
        console.error("[EMAIL] Missing credentials: EMAIL_USERNAME or EMAIL_PASSWORD is not set in environment variables.");
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,        // Use STARTTLS
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: `"Church Donation" <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
};

module.exports = sendEmail;
