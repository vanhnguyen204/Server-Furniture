import Payment from "../models/Payment.js";

class PaymentController {
    async getPaymentOfUser(req, res, next) {
        console.log('Get my payment')
        try {
            const { _id } = req.body.user;
            const response = await Payment.find({ userId: _id })
            return res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }
    async getSelectedPayment(req, res, next) {
        try {
            const {_id}  = req.body.user;
            const response = await Payment.findOne({userId: _id, isSelected: true})
            if (!response) {
                return res.status(404).json({})
            }
            return res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }
    async createPayment(req, res, next) {
        console.log('Creating payment method')
        try {
            const { _id } = req.body.user;
            const { cartNumber, bankName, expiryDate, cvv, cartHolderName, type } = req.body
            const image = handleBankImage(type)
            const checkIsEmpty = await Payment.findOne({ cartNumber })
            if (checkIsEmpty) {
                return res.status(409).json({
                    message: 'Create new payment failed.',
                    cause: 'This payment is already in use.',
                    status: 409
                })
            }
            const newPayment = new Payment({ cartNumber, bankName, expiryDate, image, cvv, cartHolderName, userId: _id, type });
            await newPayment.save();
            return res.status(201).json({ message: 'Create new payment successfully.', status: 201, data: newPayment })
        } catch (error) {
            next(error)
        }
    }
    async removePayment(req, res, next) {
        try {
            const { _id } = req.body.user;
            const { paymentId } = req.params;
            await Payment.deleteOne({ _id: paymentId, userId: _id })
            return res.json({message: 'Remove payment success', status: 200})
        } catch (error) {
            next(error)
        }
    }

    async updatePayment(req, res, next) {
        console.log('Update payment method')
        try {
            const { _id } = req.body.user;
            const { cartNumber, expiryDate, cvv, cartHolderName, type } = req.body
            const newPayment = new Payment({ cartNumber, expiryDate,cvv: `${Number(cvv)}`, cartHolderName, userId: _id, type });
            await newPayment.save();
            return res.status(201).json({ message: 'Create new payment successfully.', status: 201, data: newPayment })
        } catch (error) {
            next(error)
        }
    }
    async activePayment(req, res, next) {
        console.log('Active payment')
        try {
            const { _id } = req.body.user;
            const { paymentId } = req.params
            const isActive = await Payment.findOne({_id: paymentId, isSelected: true})
            //handle unchecked
            if (isActive) {
                console.log('UnActive')
                await Payment.updateOne({ _id: paymentId, userId: _id }, { isSelected: false })
                return res.status(200).json({message: 'UnActive success!', status: 200})
            }
            await Payment.updateMany({ userId: _id}, { isSelected: false })
            await Payment.updateOne({ _id: paymentId, userId: _id }, { isSelected: true })
            console.log('Active')

            return res.status(200).json({ message: 'Active success!', status: 200 })
        } catch (error) {
            next(error)
            return res.status(400).json({ message: 'Active failed!',status: 400 })
        }
    }
}

export const handleBankImage = (type) => {
    let image = '';

    switch (type) {
        case 'vietcombank':
            return image = '/images/icon_vietcombank.png'
        case 'acbbank':
            return image = '/images/icon_acbbank.jpg'
        case 'agribank':
            return image = '/images/icon_agribank.jpg'
        case 'mbbank':
            return image = '/images/icon_mbbank.jpg'
        case 'tpbank':
            return image = '/images/icon_tpbank.jpg'
        case 'vibbank':
            return image = '/images/icon_vibbank.jpg'
        case 'vpbank':
            return image = '/images/icon_vpbank.jpg'
        default:
            return ''
    }
}

export default new PaymentController();