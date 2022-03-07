import {Country} from '../schemas/countrySchema.js'



export async function addStock(req, res, next) {
    let { stock, countryCode } = req.body

    if (!stock || !stock.length) return res.status(403).json({success: false, error: 'Must provide an array of stock'})
    if (!countryCode || countryCode.length !== 2) return res.status(403).json({success: false, error: 'Must provide a valid country code'})

    let data = stock.filter(data => data.inviteLink !== undefined && data.inviteAddress !== undefined)

    try {
        const countryExists = await Country.exists({countryCode})
        if (!countryExists) return res.status(404).json({success: false, error: 'Invalid countryCode'})

        const updatedCountryStock = await Country.updateOne({countryCode}, {$push: { stock: data }})
        if (!updatedCountryStock) return res.stauts(401).json({success: false, error: "Stock could not be saved"})

        res.status(201).json({success: true, message: `Successfully added ${data.length} stock`, addedStock: data})
    } catch (err) {
        consola.error(err.message)
        return res.status(500).json({success: false, error: err.message, stack: err})
    }
}



// async function createCountry() {
//     const bruh = await Country.create({
//         name: "United States",
//         countryCode: "US"
//     })
//     console.log(bruh)
// }

// createCountry()