import { createTransport } from "nodemailer";

const sendOtp = async (email, otp)=>{
    const transport = createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        html:` <h2>This is your 6-digit {otp}</h2>`
    });
}

export default sendOtp