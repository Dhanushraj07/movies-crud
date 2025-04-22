
import User from '../models/userModel.js';
//const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import util from 'util';
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

export const signup = async (req, res) => {
    try {
      // Create a new user from request body
      const newUser = await User.create(req.body);
      console.log(newUser);
      // Generate JWT token
      const token = signToken(newUser._id);  
      res.status(201).json({
        status: 'success',
        token,
        data: {
          user: newUser,
        },
      });
    } catch (error) {
      // Handle duplicate email (code 11000)
      if (error.code === 11000 && error.keyPattern.email) {
        return res.status(400).json({
          status: 'fail',
          message: 'Email already exists, please login',
        });
      }
      // General error response
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  };
  

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password!',
            });
        }

        // Find user and include password (if normally excluded in schema)
        const user = await User.findOne({ email }).select('+password');
        
        // Check if user exists and password is correct
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password!',
            });
        }

        // Generate JWT token
        const token = signToken(user._id);

        // Optional: remove password from response
        user.password = undefined;
        //console.log(user);
        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully!',
            token,
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong while logging in!',
        });
    }
};


export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    }
    //console.log(req.headers); // 👀 See if 'authorization' key is present

    console.log(token);
    if(!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not logged in! Please log in to get access.',
        });
    }
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log("decoded",decoded);
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return res.status(401).json({
            status: 'fail',
            message: 'The user belonging to this token no longer exists.',
        });
    }
    // Check if user changed password after token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return res.status(401).json({
            status: 'fail',
            message: 'User recently changed password! Please log in again.',
        });
    }
    // Grant access to protected route
    req.user = currentUser;
    console.log("Request user",req.user);
    next(); 
}


// This function can be used to restrict access to certain routes based on user roles
export const restrictTo = (role) => {
    return (req, res, next) => {
        // Check if user has the required role
        if (req.user.role !== role) { 
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action!',
            });
        }
        next();
    };
}


// If we have many roles, we can use this function
// export const restrictTo = (...roles) => {
//     return (req, res, next) => {
//         // Check if user has the required role
//         if (!roles.includes(req.user.role)) { 
//             return res.status(403).json({
//                 status: 'fail',
//                 message: 'You do not have permission to perform this action!',
//             });
//         }
//         next();
//     };
// }


























// try {
//     // Get token from headers
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//     }

//     // Check if token exists
//     if (!token) {
//     return res.status(401).json({
//     status: 'fail',
//     message: 'You are not logged in! Please log in to get access.',
//     });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Check if user still exists
//     const currentUser = await User.findById(decoded.id);
//     if (!currentUser) {
//     return res.status(401).json({
//     status: 'fail',
//     message: 'The user belonging to this token no longer exists.',
//     });
//     }

//     // Grant access to protected route
//     req.user = currentUser;
//     next();
//     } catch (error) {
//     console.error(error);
//     res.status(500).json({
//     status: 'error',
//     message: 'Something went wrong while verifying the token!',
//     });
//     }