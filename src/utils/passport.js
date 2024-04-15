import passport from "passport";

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user) {
            if (err) return next(err);
            if (!user) {
                req.user = null
            }
            req.user = user;
            next();
        })(req, res, next);
    }
};