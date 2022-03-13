export async function adminOnly(req, res, next) {
    if (!req.user) {
        return res.status(401).send({
            sucess: false,
            message: "Invalid session"
        })
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Must be an admin to perfom this action"
        })
    }

    return next()
}