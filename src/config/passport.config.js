import passport from "passport";
import GitHubStrategy from "passport-github2";
import User from "../services/dao/mongo/models/user.model.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from "./variables.config.js";
import { userService } from "../services/service.js";

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwtCookieToken"];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "github",
    // @ts-ignore
    new GitHubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: `${config.BASE_URL}/api/auth/github/callback`,
      },
      async (accessToken, _refreshToken, profile, done) => {
        try {
          const email = await userService.findGitHubEmail(accessToken);

          const foundUser = await User.findOne({
            email,
          });
          if (!foundUser) {
            const newUser = await userService.register({
              email,
              username: profile._json.name,
              strategy: "github",
            });
            return done(null, newUser);
          }
          await userService.updateLastConnection(foundUser._id);
          return done(null, foundUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.JWT_SECRET_KEY,
      },
      (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    // @ts-ignore
    return done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    return done(null, user);
  });
};

export default initializePassport;
