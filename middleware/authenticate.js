import passport from "passport";
export const authenticateJWT = passport.authenticate("jwt", { session: false });
// It will check Authentication and roles of the users
export const authorize = (roles = []) => [
  authenticateJWT,
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  },
];
