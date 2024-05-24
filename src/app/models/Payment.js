import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Payment = new Schema({
    userId: { type: String, default: '' },
    cartNumber: { type: String, default: '' },
    expiryDate: { type: String, default: '' },
    cvc: { type: Number, default: 0 },
    cartHolderName: { type: String, default: '' },
    isSelected: { type: Boolean, default: false },
    type: { type: String, default: '' },
},
    {
        timestamps: true
    })


const PaymentModel = mongoose.model('Payment', Payment, 'Payment');

export default PaymentModel;