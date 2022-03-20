import {Country} from '../schemas/countrySchema.js'


export async function createCountry(req, res, next) {
    const {name, countryCode} = req.body

    if (!name || !countryCode) return res.status(400).json({success: false, message: "Please enter all fields"})
    if (!name.length || countryCode.length !== 2) return res.status(400).json({success: false, message: "Invalid Country name or Country code"})

    try {
        const newCountry = await Country.create({name, countryCode: countryCode.toUpperCase()})

        return res.status(201).json({success: true, message: "Country succesfully created", country: {_id: newCountry._id, name: newCountry.name, countryCode: newCountry.countryCode}})
    } catch (err) {
        next(err)
    }

}


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
        next(err)
    }
}



export async function getStock(req, res, next) {
    try {
        const countries = await Country.find({}).select("-_id").select("-createdAt").select("-updatedAt").select("-__v").select("-stock._id")
        if (!countries) throw new Error("No countries found")

        const stock = countries.map((country) => ({
            name: country.name,
            countryCode: country.countryCode,
            stock: country.stock.length
        }))

        return res.status(200).json({ success: true, totalCountries: countries.length, data: (req.user && req.user.role == "admin") ? countries : stock})
      
    } catch (err) {
        next(err)
    }
}
