export function requireUser(req, res, next) {
    if (!req.user) {
        return res.status(403).send({
            sucess: false,
            message: "Invalid session"
        })
    }

    return next();
}