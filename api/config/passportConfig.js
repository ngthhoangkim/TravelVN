import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../model/userModel.js";
const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8800/v1/user/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            // Create new user if doesn't exist
            user = new User({
              username: profile.emails[0].value,
              googleId: profile.id,
              email: profile.emails ? profile.emails[0].value : null,
            });
            await user.save();
          }
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};
export default configurePassport;
