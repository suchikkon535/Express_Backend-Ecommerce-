const address = require('../models/address.model')
const ApiError = require('../utils/apiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')

exports.createAdderss = asyncHandler(async (req, res) => {

    const data = req.body;
    const user = req.user._id;

    const addressLength = await address.countDocuments({ user })

    if ( addressLength >= 3) {
        throw new ApiError(400, "You can only have up to 3 addresses!")
    }

    if (data.isDefault) {
        const defaultCheck = await address.findOne({ 
            user, 
            isDefault: true 
        });

        if (defaultCheck) {
            throw new ApiError(400, "You already have a default address!");
        }
    }
    
    const addAddress = await address.create({
        user: user,
        fullName: data.fullName,
        phone: data.phone,
        addressLine: data.addressLine,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        isDefault: data.isDefault
    })

    res.json(new ApiResponse(201, "Address add successfully", addAddress))
})

exports.userAllAddress = asyncHandler(async (req, res) => {

    const allAddress = await address.find({ user: req.user._id }).select("-user")

    res.json(new ApiResponse(200, "Retrived address", allAddress))
})