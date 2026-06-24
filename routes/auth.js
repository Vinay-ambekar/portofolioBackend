const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('../config/passport');
const User = require('../models/User');
const auth = require('../middleware/auth');
const sendMail = require('../config/mail');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ message: 'User created', token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/send-otp', async (req, res) => {
  try {
    const email = process.env.SMTP_USER;
    if (!email) {
      return res.status(500).json({ message: 'SMTP_USER not configured on server' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Check 5-second cooldown
    const now = new Date();
    if (user.otpCooldownUntil && now < user.otpCooldownUntil) {
      const remainingMs = user.otpCooldownUntil.getTime() - now.getTime();
      return res.status(429).json({
        message: `Please wait ${Math.ceil(remainingMs / 1000)} second(s) before requesting a new OTP`,
        retryAfterMs: remainingMs,
      });
    }

    // Check daily attempt limit (5 per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastAttemptDate = user.otpLastAttemptDate
      ? new Date(user.otpLastAttemptDate).setHours(0, 0, 0, 0)
      : null;

    if (lastAttemptDate !== today.getTime()) {
      // Reset counter for new day
      user.otpDailyAttempts = 0;
    }

    if (user.otpDailyAttempts >= 5) {
      return res.status(429).json({
        message: 'Daily OTP limit reached (max 5 attempts per day). Try again tomorrow.',
      });
    }

    // Generate cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Store OTP (will be hashed by pre-save hook) with 5-minute expiry
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.otpCooldownUntil = new Date(Date.now() + 5 * 1000); // 5 seconds
    user.otpDailyAttempts = (user.otpDailyAttempts || 0) + 1;
    user.otpLastAttemptDate = now;
    user.otpVerifyAttempts = 0; // reset verify attempts for new OTP

    await user.save();

    // Send OTP via email
    try {
      await sendMail({
        to: user.email,
        subject: 'Your OTP for Login - Vinay Portfolio',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
            <h2>OTP Login</h2>
            <p>Your one-time password for login is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center;
                        padding: 20px; background: #f5f5f5; border-radius: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            <p>If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #888; font-size: 12px;">Vinay Portfolio</p>
          </div>
        `,
      });
    } catch (mailErr) {
      // Email failed — clear OTP data so user can retry
      user.otp = undefined;
      user.otpExpiry = undefined;
      user.otpCooldownUntil = undefined;
      user.otpDailyAttempts = Math.max(0, (user.otpDailyAttempts || 1) - 1);
      await user.save();
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }

    res.json({
      message: 'OTP sent to your email',
      retryAfterMs: 5000,
      attemptsRemaining: 5 - user.otpDailyAttempts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;
    const email = process.env.SMTP_USER;
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }
    if (!email) {
      return res.status(500).json({ message: 'SMTP_USER not configured on server' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid request' });
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: 'No OTP requested. Please request a new OTP.' });
    }

    if (new Date() > user.otpExpiry) {
      // Clear expired OTP
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    // Rate limit: max 5 failed verify attempts per OTP
    if (user.otpVerifyAttempts >= 5) {
      // Invalidate OTP after too many failed attempts
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(429).json({ message: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    const isValid = await user.compareOtp(otp);
    if (!isValid) {
      user.otpVerifyAttempts = (user.otpVerifyAttempts || 0) + 1;

      // Invalidate OTP immediately on 5th failed attempt
      if (user.otpVerifyAttempts >= 5) {
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        return res.status(429).json({ message: 'Too many failed attempts. OTP invalidated. Please request a new OTP.' });
      }

      await user.save();
      const remaining = 5 - user.otpVerifyAttempts;
      return res.status(401).json({
        message: `Invalid OTP. ${remaining} attempt(s) remaining.`,
        attemptsRemaining: remaining,
      });
    }

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpiry = undefined;
    // Keep cooldown, daily attempts as-is (they're for send-otp only)
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/update-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google OAuth — only SMTP_USER is allowed
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=unauthorized`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?token=${token}`);
  }
);

module.exports = router;
