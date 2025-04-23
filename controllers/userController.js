
import User from '../models/userModel.js';
//const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import util from 'util';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';
import { signToken } from './authController.js';


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) 
            newObj[el] = obj[el];
    });
    return newObj;
}

export const updatePassword = async (req, res) => {
    // 1. Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2. Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return res.status(401).json({
            status: 'fail',
            message: 'Your current password is wrong!',
        });
    }

    // 3. If so, update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    // 4. Log the user in, send JWT
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    });
}
//login userDetails
export const getMe = async (req, res) => {
    try {
      res.status(200).json(req.user); // req.user is set in protect middleware
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


export const updateUser = async (req, res) => {
    try {
        if(req.body.password || req.body.confirmPassword) {
            return res.status(400).json({
                status: 'fail',
                message: 'This route is not for password updates. Please use /updateMyPassword.',
            });
        }
        //Filtter object to only allow certain fields to be updated
        const filteredBody = filterObj(req.body, 'name', 'email');
        //Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: {
                user: updatedUser,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {active: false});
        res.status(204).json({
            status: 'success',
            message: 'User deleted successfully',
            data: null,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}