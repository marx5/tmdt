import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoute from './routes/uploadRoute.js';
import configRoutes from './routes/configRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('Environment:', process.env.NODE_ENV);
console.log('PayPal Client ID:', process.env.PAYPAL_CLIENT_ID);

connectDB();

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON body parser for incoming requests
app.use(express.json());

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/images', express.static(path.join(__dirname, '../images')));

// Route handlers
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);
app.use('/api/upload', uploadRoute);

// After API routes
// Serve the static index.html from React's build when in production
if(process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, 'frontend', 'build')));
    
    // Any route which is not any of the above (API) routes
    app.get('*', (req, res) => {
       res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')); 
    });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));