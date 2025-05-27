const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { sendOTP, verifyOTP } = require('../controllers/auth');


router.post('/send-otp', sendOTP);

router.post('/verify-otp', verifyOTP);

module.exports = router;