import { createTransport } from "nodemailer";

const sendOtp = async (email, otp) => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_OTP || process.env.GMAIL_APP_PASSWORD;

    if (!emailUser || !emailPass) {
        throw new Error("Email credentials are not configured. Set EMAIL_USER and EMAIL_PASS/EMAIL_OTP in the backend .env file.");
    }

    const transport = createTransport({
        service: "gmail",
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    await transport.sendMail({
        from: `Library Management <${emailUser}>`,
        to: email,
        subject: "Your OTP Code",
        html: `<h2>Your OTP code is: <strong>${otp}</strong></h2>`,
    });
};

export default sendOtp;