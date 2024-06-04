import Address from "../models/Address.js";

class AddressController {
    async getAddress(req, res, next) {
        console.log('Get address.')
        try {
            const { shippingAddressId, district } = req.body;
            if (shippingAddressId) {
                const response = await Address.find({ city: shippingAddressId })
                const filterDistrict = response.map((item) => {
                    return item.district;
                })
                return res.status(200).json(filterDistrict)
            }
            const response = await Address.distinct('city')
            return res.status(200).json(response)

        } catch (error) {

        }
    }
}

export default new AddressController()