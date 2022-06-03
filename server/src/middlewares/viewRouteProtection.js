const requireUser = (req, res, next) => {
    if (!req.user) return res.redirect('/')

    return next();
}


async function adminViewOnly(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        res.redirect("/admin");
        return
    }

    return next()
}


async function adminAndModeratorViewOnly(req, res, next) {
    if (!req.user) {
        res.redirect("/admin");
        return
    } 

    if (req.user.role == "admin" || req.user.role == "moderator") {
        return next()
    }

}




export {adminViewOnly, adminAndModeratorViewOnly, requireUser }