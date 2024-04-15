import passport from "passport";

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user) {
            if (err) return next(err);
            if (!user) {
                req.user = null
                return next()
            }
            req.user = user;
            return next();
        })(req, res, next);
    }
};