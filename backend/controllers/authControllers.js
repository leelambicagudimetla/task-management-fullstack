const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// Rigister Controller
const registerController = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message:"Please fill the blanks name, email, password.."
            });
        }

        const existinguser = await User.findOne({email});

        if(existinguser){
            return res.status(400).json({
                message: "Email is already existed..."
            });
        }

        // const hashedPassword = await bcrypt.hash(password,10);
        
        const user = await User.create({
            name,
            email,
            password
        });

        const token = jwt.sign(
            {
            userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d"
            }
        );

        return res.status(201).json({
             message:"successfully created",
             token,
             user:{
                id:user._id,
                name:user.name,
                email:user.email
             }
        })
    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
};

// Me Controller
const meController = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Login Controller
const loginController = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Please provide correct one"
            });
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message: "email not existed..."
            });
        }
        
        console.log("Email entered:", email);
        console.log("Password entered:", password);
        console.log("Password from DB:", user.password);

        const pass = await bcrypt.compare(
            password,
            user.password
        );
        console.log(pass);

        if(!pass){
            return res.status(400).json({
                message: "password is wrong..."
            });
        }

        const token = jwt.sign(
            {
            userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d"
            }
        );

        return res.status(201).json({
            message:"Login successfull...",
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch(error){
        return res.status(500).json({
            message: error.message
        }); 
    }
};

module.exports = {
    registerController,
    loginController,
    meController
};