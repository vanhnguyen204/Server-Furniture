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
    async createPayment(req, res, next) {
        console.log('Creating payment method')
        try {
            const { _id } = req.body.user;
            const { cartNumber, bankName, expiryDate, cvv, cartHolderName, type } = req.body
            const image = handleBankImage(type)
            const checkIsEmpty = await Payment.findOne({ cartNumber })
            if (checkIsEmpty) {
                return res.status(409).json({
                    message: 'Tạo phương thức thanh toán thất bại.',
                    cause: 'Phương thức thanh toán này đã được sử dụng.',
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
            const { cartId } = req.body;
            await Payment.deleteOne({ _id: cartId, userId: _id })
            return res.json({message: 'Remove payment success', status: 200})
        } catch (error) {
            next(error)
        }
    }

    async updatePayment(req, res, next) {
        console.log('Update payment method')
        try {
            const { _id } = req.body.user;
            const { cartNumber, expiryDate, cvc, cartHolderName, type } = req.body
            const newPayment = new Payment({ cartNumber, expiryDate, cvc, cartHolderName, userId: _id, type });
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
            const { paymentId } = req.body
            const checkActive = await Payment.findOne({ isSelected: true })
            await Payment.updateOne({ _id: checkActive._id }, { isSelected: false })
            await Payment.updateOne({ _id: paymentId, userId: _id }, { isSelected: true })
            return res.status(200).json({ message: 'Active success!' })
        } catch (error) {
            next(error)
            return res.status(400).json({ message: 'Active failed!' })
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