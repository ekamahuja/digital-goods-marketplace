import rateLimit from 'express-rate-limit'


export const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: async (req, res) => {
        if (req.user) return 9999 
        return 100
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({success: false, message: options.message})
    }
})


export const apiKeyLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: async (req, res) => {
        if (req.user) return 9999 
        return 180
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({success: false, message: options.message})
    }
})



export const apiStockLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: async (req, res) => {
        if (req.user) return 9999 
        return 30
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({success: false, message: options.message})
    }
})
