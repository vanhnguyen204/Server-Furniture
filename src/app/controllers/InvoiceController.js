import InvoiceDetail from "../models/InvoiceDetail.js";
import Invoice from "../models/Invoice.js";
import Cart from "../models/Cart.js";
import { formatDate } from "../../utils/formatDate.js";
class InvoiceController {

    async createInvoice(req, res, next) {
        console.log('Creating invoice.')
        try {
            const { _id } = req.body.user;
            const { totalPrice, data, paymentType,
                shippingAddress,delivery } = req.body;
            const now = new Date();
            const timeNowFormatted = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            const newInvoice = new Invoice({
                userId: _id,
                totalPrice: totalPrice,
                dateExport: timeNowFormatted,
                paymentType,
                shippingAddress,
                delivery
            })
            const response = await newInvoice.save();
            for (let index = 0; index < data.length; index++) {
                const newInvoiceDetail = new InvoiceDetail({
                    productId: data[index].productId,
                    price: data[index].price,
                    quantity: data[index].quantity,
                    invoiceId: response._id
                })
                newInvoiceDetail.save();
            }
            await Cart.deleteMany({ userId: _id })
            console.log('Create invoice success.')
            res.status(201).json({ message: 'Create invoice success!', status: 201 })
        } catch (error) {
            next(error)
        }
    }

    async getMyInvoice(req, res, next) {
        try {
            const { _id } = req.body.user
            const response = await Invoice.find({ userId: _id })
            const filter = response.map((item) => {
                item.createdAt = formatDate(item.createdAt)
                return item
            })
            res.json(filter)
        } catch (error) {
            next(error)
        }
    }
}

export default new InvoiceController();