
import User from '../models/userModel.js';
//const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
export const signup = async(req, res) => {
    const newUser = await User.create(req.body);
    console.log(newUser);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {  
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    
    try {
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
        
    }
}

export const login = async(req, res) => {
    const { email, password } = req.body;
}
    