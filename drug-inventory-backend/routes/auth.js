const express = require('express');
const { login, register } = require('../controllers/authController');
const router = express.Router();

// Route for user login
router.post('/login', login);

// Optional: Route for user registration
router.post('/register', register);

module.exports = router;
