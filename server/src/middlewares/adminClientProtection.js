export default async function adminClientRouteProtection(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        res.redirect("/admin");
        return
    }

    return next()
}