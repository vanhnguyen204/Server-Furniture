import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Invoice = new Schema({
    userId: { type: String, default: '' },
    totalPrice: { type: Number, default: 0 },
    dateExport: { type: String, default: '' },
    paymentType: { type: String, default: '' },
    shippingAddress: { type: String, default: '' },
    delivery: { type: String, default: '' },
},
    {
        timestamps: true
    })


const InvoiceModel = mongoose.model('Invoice', Invoice, 'Invoice');

export default InvoiceModel;