import UserModel from "../model/UserModel.js";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as JWTstrategy, ExtractJwt } from "passport-jwt";
import config from "../utils/config/config.js";
import { AUTH_MESSAGES } from "../utils/responseMessages.js";

passport.use(
  "login",
  new localStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: AUTH_MESSAGES.USER_NOT_FOUND });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, { message: AUTH_MESSAGES.WRONG_PASSWORD });
        }
        return done(null, user, { message: AUTH_MESSAGES.LOGIN_SUCCESS });
      } catch (error) {
        done(error);
      }
    }
  )
);
passport.use(
  new JWTstrategy(
    {
      secretOrKey: config.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
