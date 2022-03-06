export function requireUser(req, res, next) {
    if (!req.user) {
        return res.status(403).send({
            sucess: false,
            error: "Invalid session"
        })
    }

    return next();
}