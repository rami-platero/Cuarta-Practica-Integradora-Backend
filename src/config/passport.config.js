import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import User from "../dao/database/models/user.model.js";
import { config } from "../config.js";
import UserService from "../dao/database/services/user.service.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, _username, _password, done) => {
        try {
          console.log("registering", req.body);
          const { username, email, password } = req.body;
          const user = await UserService.register({
            email,
            password,
            username,
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, _username, _password, done) => {
        try {
          const { email, password } = req.body;

          const user = await UserService.login({ email, password });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    // @ts-ignore
    new GitHubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/auth/github/callback",
      },
      async (accessToken, _refreshToken, profile, done) => {
        try {
          const email = await UserService.findGitHubEmail(accessToken);

          const foundUser = await User.findOne({
            email,
          });
          if (!foundUser) {
            const newUser = await UserService.register({
              email,
              username: profile._json.name,
              strategy: "github",
            });
            return done(null, newUser);
          }
          return done(null, foundUser);
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
