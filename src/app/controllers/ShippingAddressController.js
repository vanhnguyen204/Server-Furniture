import ShippingAddress from "../models/ShippingAddress.js";

class ShippingAddressController {
    async getMyShippingAddress(req, res, next) {
        console.log('Get my shipping address')
        try {
            const { _id } = req.body.user;
            const response = await ShippingAddress.find({ userId: _id })
            return res.status(200).json(response);
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const { _id } = req.body.user;
            const {
                country,
                city,
                district,
                addressDetail,
                recipient,

            } = req.body;

            const newAddress = new ShippingAddress({
                userId: _id,
                country,
                city,
                district,
                addressDetail,
                recipient,

            });

            await newAddress.save();
            console.log('Create shipping address success!')
            return res.status(201).json({ message: 'Create new shipping address success.', newAddress, status: 201 });
        } catch (error) {
            next(error)

        }
    }
    async update(req, res, next) {
        try {
            const { _id } = req.body.user;
            const {
                shippingAddressId,
                country,
                city,
                district,
                addressDetail,
                recipient
            } = req.body;

            const checkVar = await ShippingAddress.findOne({ _id: shippingAddressId })
            console.log(checkVar)
            // await newAddress.save();
            // return res.status(201).json({ message: 'Create new shipping address success.', newAddress });
        } catch (error) {
            next(error)

        }
    }

    async delete(req, res, next) {
        try {
            const { _id } = req.body.user;
            const { addressId } = req.body
            await ShippingAddress.deleteOne({ _id: addressId, userId: _id })
            return res.status(200).json({ message: 'Delete shipping address success.', status: 200 })
        } catch (error) {
            next(error)
        }
    }

    async activeShippingAddress(req, res, next) {
        try {
            const { _id } = req.body.user;
            const { shippingAddressId } = req.body;
            const checkVar = await ShippingAddress.findOne({ _id: shippingAddressId });
            if (checkVar.isSelected) {
                await ShippingAddress.updateOne({ _id: shippingAddressId }, { isSelected: false })
                return res.status(200).json({ message: 'Active shipping address success!', status: 200 })

            }
            await ShippingAddress.updateMany({ userId: _id }, { isSelected: false })
            await ShippingAddress.updateOne({ userId: _id, _id: shippingAddressId }, { isSelected: true })
            return res.status(200).json({ message: 'Active shipping address success!', status: 200 })
        } catch (error) {
            next(error)
        }
    }

}

export default new ShippingAddressController();