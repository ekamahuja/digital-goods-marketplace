import productData from '../config/productData.js'


/**
 * It takes a product ID from the URL, checks if it exists in the productData object, and if it does,
 * it returns the product data.
 * @param req - The request object
 * @param res - the response object
 * @param next - The next middleware function in the stack.
 */
export const getProductData = async (req, res, next) => {
    try {
        /* Destructuring the pid property from the req.params object. If the pid property is not
        present, it will throw an error. */
        const {pid} = req.params
        if (!pid) throw new Error("No product ID provided")

        /* Checking if the product ID exists in the productData object. If it does, it will return the
        product data. */
        if (!productData[pid]) throw new Error("Invalid product ID")
        const {name, amount, cryptoAmount, description, paymentType, planType} = productData[pid]

        /* Creating an object with the product data. */
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
        
        /* Sending the data object to the client. */
        res.json(data)
    } catch(err) {
        next(err)
    }
}