import productData from '../config/productData.js'


export const getProductData = async (req, res, next) => {
    try {
        const {pid} = req.params
        if (!pid) throw new Error("No product ID provided")

        if (!productData[pid]) throw new Error("Invalid product ID")
        const {name, amount, cryptoAmount, description, paymentType, planType} = productData[pid]

        const data = {
            success: true,
            id: pid,
            name,
            amount,
            cryptoAmount,
            description,
            paymentType,
            planType
        }
        
        res.json(data)
    } catch(err) {
        next(err)
    }
}