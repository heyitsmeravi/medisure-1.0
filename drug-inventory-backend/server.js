// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON

// Connect to MongoDB (update with your connection string)
mongoose.connect('mongodb://localhost:27017/drug_inventory_system', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Utility to send email
const sendPasswordResetEmail = async (email, resetLink) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // use your email service
        auth: {
            user: 'ravinilos1230@gmail.com',  // Replace with your actual email
            pass: 'yjcsdkjqurtmtttb',    // Replace with the App Password from Google
        },
    });

    const mailOptions = {
        from: 'ravinilos1230@gmail.com', // Replace with your actual email
        to: email,                   // Email to send the reset link to
        subject: 'Password Reset',
        text: `Click here to reset your password: ${resetLink}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reset link sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send reset link.');
    }
};

// Routes
// Signup Route
app.post('/signup', async (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).json({ success: false, msg: "Passwords do not match." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.status(201).json({ success: true, msg: "User registered successfully." });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ success: false, msg: "Username or email already exists." });
        }
        res.status(500).json({ success: false, msg: "An error occurred during signup." });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, msg: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, msg: "Invalid password." });
        }

        res.json({ success: true, msg: "Login successful." });
    } catch (error) {
        res.status(500).json({ success: false, msg: "An error occurred during login." });
    }
});

// Forgot Password Route
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, msg: "Email not found." });
        }

        // Generate a fake reset link (in a real app, you would generate a token and use it)
        const resetLink = `http://localhost:5000/reset-password?email=${encodeURIComponent(email)}`;

        await sendPasswordResetEmail(email, resetLink);
        res.json({ success: true, msg: 'Reset link sent to your email.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Failed to send reset link.' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
