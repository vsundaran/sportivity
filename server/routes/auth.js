const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create a real transporter using environment variables
function createTransporter() {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail', // e.g., 'Gmail', 'SendGrid', etc.
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email address'
      });
    }
    
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
      await user.save();
    }
    
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(process.env.OTP_EXPIRE_MINUTES || 10));
    
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });
    
    const otpRecord = new OTP({
      email,
      otp,
      expiresAt
    });
    await otpRecord.save();
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'OTP Service'}" <${process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER}>`,
      to: email,
      subject: process.env.OTP_EMAIL_SUBJECT || 'Your OTP Code',
      text: `Your OTP is: ${otp}. It will expire in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
          <p>Please use the following OTP to verify your identity:</p>
          <div style="background: #f4f4f4; padding: 10px; margin: 20px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
            <strong>${otp}</strong>
          </div>
          <p>This OTP is valid for ${process.env.OTP_EXPIRE_MINUTES || 10} minutes. Please do not share it with anyone.</p>
          <p style="color: #888; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send OTP',
      message: error.message 
    });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const otpRecord = await OTP.findOne({ email, otp });
    
    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }
    
    await User.findOneAndUpdate({ email }, { isVerified: true });
    
    await OTP.deleteOne({ _id: otpRecord._id });
    
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(200).json({ 
      success:true,
      message: 'OTP verified successfully',
      token,
      data: User
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

module.exports = router;