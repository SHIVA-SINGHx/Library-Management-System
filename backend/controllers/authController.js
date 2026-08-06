import { generate } from "otp-generator";
import User from "../models/UserModel.js"
import sendOtp from "../utils/sendOtp.js";
import { v4 as uuidv4 } from "uuid";



export async function registerUser(req, res){

    try {

    const {email, password, name, phoneNo } = req.body;
    if(!email) return res.status(400).json({
        message: "Email is required"
    });

    const cleanPhone = phoneNo ? phoneNo.toString().replace(/\D/g, "") : "";
    if(cleanPhone.length !== 10 ){
        return res.status(400).json({
            message: "Mobile number must be 10 digit"
        })
    }

    const existingUser=  await User.findOne({email});
    if (existingUser){
        if(existingUser.isVerified) return res.status(400).json({
            message: 'User already exists'
        })
        await User.deleteOne({email});
    }
    
    const otp = generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    try {
        await sendOtp(email, otp);

    } catch (emailerror) {
       console.error("Error sending Otp email", emailerror);
       return res.status(500).json({
        message: 'Failed to send Otp, Please try again'
       });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const studentId = `ST-${uuidv4().slice(0, 8).toUpperCase()}`;

    const user = await User.create({
        name,
        email, 
        password: hashedpassword,
        phoneNo: cleanPhone,
        otp,
        otpExpiry,
        studentId
    });
    return res.status(201).json({
        message: "User registered successfully, OTP sent to the email",
        user
    })


    } catch (error) {
        console.log("Error registering user: ", error)
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }



}


/// verify otp
export async function verifyOtp(req, res){

    try {
        const {email, otp} = req.body;
        if(!email)return res.status(400).json({
            message: "Email is required"
        })
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        if(user.otp !== otp || new Date() > new Date(user.otpExpiry)){
            return res.status(400).json({
                message: "Invalid or expired otp."
            });
        }

        Object.assign(user, {isVerified: true, otp: null, otpExpiry: null});
        await user.save()
        return res.status(201).json({
            message: "Otp verified successfully"
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error verifying otp',
            error: error.message
        })
    }

}