import jwt from "jsonwebtoken"
import User from "../models/UserModel.js";


export const authToken = async(req, res, next)=>{
    try {
        const authHeaders = req.headers("authorization")
        const token = authHeaders && authHeaders.split(" ")[1];

        if(!token){
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user){
            return res.status(401).json({
                success :false,
                message: 'Token is not valid and user is no longer exist'
            })
        }

    } catch (error) {
        console.error("JWT auth error:", error);
        res.status(500).json({ message: "token is not valid", error: error.message });
    }
}

// authorize specific roles
export const authRoles = async(...roles)=> {
    return (req, res, next)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "Access Forbidden"
            });
        }
        next();
    }
}


