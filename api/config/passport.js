// config/passport.js
import passport from "passport";
import FacebookStrategy from "passport-facebook";
import User from "../model/userModel.js";

const configPassport = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:8800/v1/user/facebook/callback",
        profileFields: ["id", "displayName", "emails"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ facebookId: profile.id });

          if (!user) {
            user = new User({
              username: profile.displayName,
              facebookId: profile.id,
              email: profile.emails ? profile.emails[0].value : null,
            });
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default configPassport;
