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



export async function deleteCountry(req, res, next) {
    try {
        const {countryCode} = req.body
        if (!countryCode) throw new Error("Please enter all fields")

        const deletedCountry = await Country.findOneAndDelete({countryCode})
        if (!deletedCountry) throw new Error("Failed to delete the country")

        res.json({success: true, message: `Successfully deleted ${deletedCountry.name.charAt(0).toUpperCase() + deletedCountry.name.slice(1).toLowerCase()}`})
    } catch (err) {
        next(err)
    }
}



export async function addStock(req, res, next) {
    try {
        let { stock, countryCode } = req.body

        if (!stock || !stock.length) throw new Error('Must provide an array of stock')
        if (!countryCode || countryCode.length !== 2) throw new Error('Must provide a valid country code')

        let data = stock.filter(data => data.inviteLink !== undefined && data.inviteAddress !== undefined)

        const countryExists = await Country.exists({countryCode})
        if (!countryExists) throw new Error('Invalid countryCode')

        const updatedCountryStock = await Country.updateOne({countryCode}, {$push: { stock: data }})
        if (!updatedCountryStock) throw new Error("Stock could not be saved")

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
