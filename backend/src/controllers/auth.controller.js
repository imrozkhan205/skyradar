// import express from "express"
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async(req,res)=>{
    const {email, password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message: "Enter all the credentials"})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password should be greater than 6 characters"})
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email format"})
        }
        const existingUser = await User.findOne({ email })
        if (existingUser){
            return res.status(400).json({message: "Email already exists"})
        }

        const newUser = await User.create({
            email,
            password,  
        })

        const token = jwt.sign({userId: newUser._id},
            process.env.JWT_SECRET_KEY,{
                expiresIn: "7d"
            }
        )
        res.cookie("jwt", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })
        res.status(201).json({success:true, user: newUser})
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({message:"Internal Server Error"});
        
    }

}

export const login = async (req,res) => {
   
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid email or password"});

        const isPasswordCorrect = await user.matchPassword(password);

        if(!isPasswordCorrect) return res.status(401).json({
            message: "Invalid email or password"
        });

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        })
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({success: true, user });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const logout = async(req, res)=>{
    res.clearCookie("jwt");
    res.status(200).json({success: true, message: "Logout successful"})

}


export const getMe = async (req, res) => {
  try {
    // Check if user is authenticated (adjust based on your auth method)
    // Example for JWT:
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Return the authenticated user
    res.json(req.user);
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
