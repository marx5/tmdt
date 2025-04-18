import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        let decoded;
        
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Excluding password field with minus sign in select function
            const user = await User.findById(decoded.id).select('-password');
            
            if(user) {
                req.user = user;
                next();
            }
            else {
                res.status(400);
                throw new Error('Bad request: Invalid user ID in token');
            }
        }
        catch(err) {
            res.status(400);
            throw new Error('Bad request: Invalid token');
        }
    }
    else {
        res.status(401);
        throw new Error('Not authorized: No token found');
    }
})

const admin = (req, res, next) => {
    if(req.user.isAdmin) {
        next();
    }
    else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
}

export { protect, admin };