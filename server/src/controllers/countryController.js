import {upgradeStock} from '../schemas/upgradeStockSchema.js'
import fetch from 'node-fetch'

export async function createCountry(req, res, next) {
    try {
        let { countryCode } = req.body
        countryCode = countryCode.toUpperCase()

        if (!countryCode) throw new Error('Please Provide a Country Code')
        if (countryCode.length !== 2) throw new Error("Invalid country code")

        const request = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        const response = await request.json()
        
        const countryAlreadyExists = await upgradeStock.findOne({ countryCode })
        if (countryAlreadyExists) throw new Error("Country already exists")

        if (request.status == 404) throw new Error("Invalid country code")

        const countryName = response[0].name.common

        const newCountry = await upgradeStock.create({name: countryName, countryCode})

        return res.status(201).json({success: true, message: "Country successfully created", country: newCountry})
    } catch(err) {
        next(err)
    }
}



export async function deleteCountry(req, res, next) {
    try {
        const {countryCode} = req.body
        if (!countryCode) throw new Error("Please enter all fields")

        const deletedCountry = await upgradeStock.findOneAndDelete({countryCode})
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

        const countryExists = await upgradeStock.exists({countryCode})
        if (!countryExists) throw new Error('Invalid countryCode')

        const updatedCountryStock = await upgradeStock.updateOne({countryCode}, {$push: { stock: data }})
        if (!updatedCountryStock) throw new Error("Stock could not be saved")

        res.status(201).json({success: true, message: `Successfully added ${data.length} stock`, addedStock: data})
    } catch (err) {
        next(err)
    }
}



export async function getStock(req, res, next) {
    try {
        const countries = await upgradeStock.find({}).select("-_id").select("-createdAt").select("-updatedAt").select("-__v").select("-stock._id")
        if (!countries) throw new Error("No countries found")

        const stock = countries.map((country) => ({
            name: country.name,
            countryCode: country.countryCode,
            stock: country.stock.length
        }))

        console.log(process.pid)
        return res.status(200).json({ success: true, message: "Stock successfully fetched", totalCountries: countries.length, data: (req.user && req.user.role == "admin") ? countries : stock})
      
    } catch (err) {
        next(err)
    }
}
