export function lol(req, res, next) {
    if (!req.user) {
        return res.status(403).send({
            sucess: false,
            message: "Invalid session"
        })
    }

    return next();
}


export function adminApiOnly(req, res, next) {
    if (!req.user) {
        return res.status(401).send({
            success: false,
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



export function adminAndModeratorApiOnly(req, res, next) {
    if (!req.user) {
        return res.status(401).send({
            success: false,
            message: "Invalid session"
        })
    }

    if (req.user.role !== "moderator") { 
        return res.status(403).json({
            success: false,
            message: "Must be a moderator to perfom this action"
        })
    }

    return next()
}



export function tryThis(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "You are not authed"
        })
    }

    return next()
}