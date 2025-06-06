// function to register a new user
const User = require('../models/user.model');
const generate = require('../../../helpers/generate.js');
const md5 = require('md5');
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

module.exports = {
    register,
    login
};