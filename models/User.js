const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  otp: { type: String },
  otpExpiry: { type: Date },
  otpCooldownUntil: { type: Date },
  otpDailyAttempts: { type: Number, default: 0 },
  otpLastAttemptDate: { type: Date },
  otpVerifyAttempts: { type: Number, default: 0 },
}, { timestamps: true, strict: false });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('otp') || !this.otp) return next();
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.compareOtp = async function (candidateOtp) {
  if (!this.otp) return false;
  return bcrypt.compare(candidateOtp, this.otp);
};

module.exports = mongoose.model('User', UserSchema);
