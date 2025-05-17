const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
      await user.save();
    }
    
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(process.env.OTP_EXPIRE_MINUTES));
    
    const otpRecord = new OTP({
      email,
      otp,
      expiresAt
    });
    await otpRecord.save();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}. It will expire in ${process.env.OTP_EXPIRE_MINUTES} minutes.`
    };
    
    const info  = await transporter.sendMail(mailOptions);
    
    res.status(200).json({success:true, message: 'OTP sent successfully', info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
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
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

module.exports = router;