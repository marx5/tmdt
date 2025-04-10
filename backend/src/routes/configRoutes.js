import express from 'express';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// @desc       Get PayPal client ID
// @route      GET /api/config/paypal
// @access     Public
router.get('/paypal', asyncHandler(async (req, res) => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    console.log('PayPal Client ID from env:', clientId); // Debug log
    
    if (!clientId || clientId === 'YOUR_CLIENT_ID') {
        console.error('Invalid PayPal Client ID:', clientId);
        res.status(500);
        throw new Error('PayPal client ID is not configured properly');
    }
    
    console.log('Sending PayPal Client ID to client:', clientId);
    res.json({ clientId }); // Send as JSON object
}));

export default router; 