const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;

    // Only allow SMTP_USER to log in via Google
    if (!email || email !== process.env.SMTP_USER) {
      return done(null, false, { message: 'Unauthorized email' });
    }

    // Find or create the user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password: `google_${profile.id}`, // placeholder — user can't log in with password
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

module.exports = passport;
