import Sellix from '@sellix/node-sdk'
const sellix = Sellix("RqxQrDBCFEu3iEEK9bg3eatgHGUn9YJA3kW6CI90Vj5zXLzoFstae1OJwTFWhsbX")



export const orderData = async (orderId) => {
    try {
        return await sellix.Orders(orderId)
    } catch(err) {
        return err.message
    }
}