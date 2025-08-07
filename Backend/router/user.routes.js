const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// User registration route
router.post('/register', authController.register);

// POST /api/user/login
router.post('/login', authController.login);

// POST /api/user/register
router.post('/register', authController.register);

module.exports = router;
