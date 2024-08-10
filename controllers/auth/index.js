require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

exports.signup = async (req, res) => {
    try {
        const userData = req.body;

        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered.",
            });
        } else {
            const usernameInUse = await User.findOne({
                username: userData.username,
            });

            if (usernameInUse) {
                return res.status(400).json({
                    message: "Username already in use.",
                });
            }
        }

        const saltRounds = 10;
        const hashedPwd = await bcrypt.hash(userData.password, saltRounds);

        const newUser = new User({
            name: userData.name,
            username: userData.username,
            email: userData.email,
            hashedPwd,
            github: userData.github,
            linkedin: userData.linkedin,
        });
        await newUser.save();

        res.status(201).json({
            user: {
                id: newUser._id,
                name: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to register user!",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select(
            "email username name hashedPwd"
        );

        if (!user) {
            res.status(500).json({
                success: false,
                message: "User not found!",
            });
        } else {
            const passwordMatch = await bcrypt.compare(
                password,
                user.hashedPwd
            );
            if (!passwordMatch) {
                return res.status(203).json({
                    message: "Incorrect password!",
                });
            } else {
                const token = jwt.sign(
                    {
                        id: user._id.toString(),
                        email: user.email,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d",
                    }
                );

                res.status(200).json({
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                    },
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to login!",
        });
    }
};