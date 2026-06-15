const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const logger = require('./logger');

const configurePassport = () => {
  // JWT Strategy
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_ACCESS_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.sub).select('-password');
          if (!user) return done(null, false);
          if (!user.isActive) return done(null, false, { message: 'Account deactivated' });
          return done(null, user);
        } catch (error) {
          logger.error('JWT Strategy error:', error);
          return done(error, false);
        }
      }
    )
  );

  // Google OAuth Strategy
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email from Google'), false);

          let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              user.isEmailVerified = true;
              await user.save();
            }
            return done(null, user);
          }

          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value,
            isEmailVerified: true,
            isActive: true,
          });

          return done(null, user);
        } catch (error) {
          logger.error('Google Strategy error:', error);
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

module.exports = configurePassport;
