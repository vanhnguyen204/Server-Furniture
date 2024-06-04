import mongoose from "mongoose";

const Schema = mongoose.Schema;

const InvoiceDetail = new Schema({
    invoiceId: { type: String, default: '' },
    productId: { type: String, default: '' },
    price: { type: Number, default: '' },
    quantity: { type: Number, default: '' },
   
},
    {
        timestamps: true
    })


const InvoiceDetailModel = mongoose.model('InvoiceDetail', InvoiceDetail, 'InvoiceDetail');

export default InvoiceDetailModel;