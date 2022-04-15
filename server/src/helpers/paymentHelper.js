import randomKey from 'random-key'



export const calculateFees = (paymentMethod, amount) => {
    if (paymentMethod == 'stripe') {
        let fee = 0;
        fee = (amount * 0.029) + 0.30
        return fee
    }
    return 0.00
}


export const generateOrderId = () => {
    const id = randomKey.generate(18)
    return id
}