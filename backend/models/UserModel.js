import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phoneNo:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    otp: String,
    otpExpiry: Date,
    isVerified:{
        type: Boolean,
        default: false
    },
    department: String,
    stream: String,
    semester: String,
    year: String,
    rollno: String,
    isProfileComplete:{
        type: Boolean,
        default: false
    },
    studentId:{
        type: String,
        unique: true,
        sparse: true
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

}, {timestamps: true});

export default mongoose.model("User", userSchema);