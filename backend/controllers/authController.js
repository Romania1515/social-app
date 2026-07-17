import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};


export const register = async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;


        const existingUser = await User.findOne({
            email
        });


        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });


        res.status(201).json({

            message: "Account created",

            token: generateToken(user._id),

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



export const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user = await User.findOne({
            email
        });


        if (!user) {

            return res.status(400).json({
                message: "Invalid credentials"
            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(400).json({
                message: "Invalid credentials"
            });

        }


        res.json({

            token: generateToken(user._id),

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
