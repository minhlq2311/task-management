// function to register a new user
const User = require('../models/user.model');
const generate = require('../../../helpers/generate.js');
const md5 = require('md5');
const sendMailHelper = require('../../../helpers/sendMail.js');

const ForgotPassword = require('../models/forgot-password.model');

const register = async (req, res) => {
    try{
        // Check if user already exists
        const existingEmail = await User.findOne({ email: req.body.email }, { deleted: false });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const infoUser = {
            fullName: req.body.fullName,
            email: req.body.email,
            password: md5(req.body.password),
            tokenUser: generate.generateRandomString(20),
        };
        
        // Create new user
        const user = new User(infoUser);
        await user.save();

        const token = user.tokenUser;
        res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
        });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
};


// [POST] /api/v1/users/login
const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = md5(req.body.password);

        // Find user by email
        const user = await User.findOne({ email:email, deleted: false });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email' });
        }

        // Check password
        if(password !== user.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = user.tokenUser;
        res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
        });
        res.status(200).json({ message: 'Login successful', user });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in user' });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email, deleted: false });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email' });
        }

        // Generate OTP
        const otp = generate.generateRandomNumber(6);
        const timeExpired = 5; // 5 minutes
        
        const objectForgotPassword = {
            email: email,
            otp: otp,
            expireAt: Date.now() + timeExpired * 60 * 1000, // 5 minutes from now
        };
        // Save OTP to database
        const forgotPassword = new ForgotPassword(objectForgotPassword);
        await forgotPassword.save();

        // Send OTP to email
        const subject = 'Password Reset OTP';
        const html = `<p>Your OTP is: <strong>${otp} expires in ${timeExpired} minutes</strong></p>`;
        sendMailHelper.sendMail(email, subject, html);

        res.status(200).json({ message: 'OTP sent to email' , otp:otp});
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

const otpPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;

        // Find OTP in database
        const forgotPassword = await ForgotPassword.findOne({ email: email, otp: otp});
        if (!forgotPassword) {
            return res.status(404).json({ message: 'Invalid OTP' });
        }

        const user = await User.findOne({ email: email, deleted: false });
        res.cookie('token', user.tokenUser, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
        });

        res.status(200).json({ message: 'OTP verified successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};

const resetPasswordPost = async (req, res) => {
    try {
        const token = req.body.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const password = md5(req.body.password);
        const user = await User.findOneAndUpdate({tokenUser:token});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(password === user.password) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password' });
        }
        user.password = password;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password' });
    }
};


const userDetail = async (req, res) => {
    res.status(200).json({
        message: 'User details retrieved successfully',
        user: req.user
    });
};

const list = async (req, res) => {
    try {
        const users = await User.find({ deleted: false }).select("fullname email");
        res.status(200).json({ message: 'User list retrieved successfully', users });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user list' });
    }
};
module.exports = {
    register,
    login,
    forgotPassword,
    otpPassword,
    resetPasswordPost,
    userDetail,
    list
};