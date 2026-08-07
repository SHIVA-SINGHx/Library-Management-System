import { generate } from "otp-generator";
import User from "../models/UserModel.js";
import sendOtp from "../utils/sendOtp.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken"


// register user
export async function registerUser(req, res) {
  try {
    const { email, password, name, phoneNo } = req.body;
    if (!email)
      return res.status(400).json({
        message: "Email is required",
      });

    const cleanPhone = phoneNo ? phoneNo.toString().replace(/\D/g, "") : "";
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        message: "Mobile number must be 10 digit",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified)
        return res.status(400).json({
          message: "User already exists",
        });
      await User.deleteOne({ email });
    }

    const otp = generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    try {
      await sendOtp(email, otp);
    } catch (emailerror) {
      console.error("Error sending Otp email", emailerror);
      return res.status(500).json({
        message: "Failed to send Otp, Please try again",
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
      studentId,
    });
    return res.status(201).json({
      message: "User registered successfully, OTP sent to the email",
      user,
    });
  } catch (error) {
    console.log("Error registering user: ", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

/// verify otp
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email)
      return res.status(400).json({
        message: "Email is required",
      });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.otp !== otp || new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({
        message: "Invalid or expired otp.",
      });
    }

    Object.assign(user, { isVerified: true, otp: null, otpExpiry: null });
    await user.save();
    return res.status(201).json({
      message: "Otp verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error verifying otp",
      error: error.message,
    });
  }
}

// complete profile
export async function completeProfile(req, res) {
  try {

    const { email, department, semester, year, rollNo, stream } = req.body;
    if (!email)
      return res.status(404).json({
        message: "Email not found",
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });
    if (!user.isVerified)
      return res.status(403).json({
        message: "User not verified",
      });

    Object.assign(user, {
      department,
      semester,
      year,
      rollNo,
      isProfileComplete: true,
    });
    await user.save();
    return res.status(200).json({
      message: "Profile Completed Successfully ",
    });

  } catch (error) {
    console.log(error)
    return response.status(500).json({
        message: 'Error completing profile',
        error: error.message
    })

  }
}

// login as user or admin
export async function loginUser(req, res){
    try {
        const {email, password} = req.body;
        if(!email || password){
            return res.status(400).json({
                success: false,
                message: 'Email and Password are required'
            })
        }

    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    if(!user.isVerified){
        return res.status(403).json({
            success: false,
            message: "Please verify your email with OTP before login in"
        })
    }

    if(!(await bcrypt.compare(password, user.password))){
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "7d"})
    const {password, _, ...userResponse} = user.toObject();

    res.status(200).json({
        success: true,
        token,
        user: userResponse
    })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Login user failed ",
            error: error.message
        })
    }


}

// get current user profile
export async function getProfile(req, res){
    try {

        const user = await User.findById(req.user.id).select("-password");
        if(!user) return res.status(404).json({success: false, message: "User not found"})
        return res.status(200).json({
            success: true,
            user
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Fetching profile error",
            error: error.message
        })
    }
}

// update user profile
export async function updateProfile(req, res) {
  try {
    const { name, email, phoneNo, department, stream, semester, academicYear, rollNumber } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== user.email.toLowerCase()) {
        if (user.role === "user") {
          return res.status(400).json({ message: "Students are not allowed to change their email address" });
        }
        if (await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } })) {
          return res.status(400).json({ message: "Email already in use" });
        }
        user.email = normalizedEmail;
      }
    }
    if (phoneNo) {
      const cleanPhone = phoneNo.toString().replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
      }
      user.phoneNo = cleanPhone;
    }

    if (name) user.name = name;
    if (department) user.department = department;
    if (stream) user.stream = stream;
    if (semester) user.semester = semester;
    if (academicYear) user.year = academicYear;
    if (rollNumber) user.rollNo = rollNumber;

    await user.save();
    res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
}

// get all users profile
export async function getUsers(req, res){
  try {
    const users = await User.find({role: "user", isVerified: true, isProfileComplete: true}).select("-password")
    return res.status(200).json({
      success: true,
      users
    })
    
  } catch (error) {
    console.error("Error fething profile:", error);
    res.status(500).json({ message: "Error fething profile", error: error.message });
  }
}