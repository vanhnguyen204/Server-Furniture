import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ShippingAddress = new Schema({
        userId: {type: String, default: ''},
        country: {type: String, default: ''},
        city: {type: String, default: 0},
        district: {type: String, default: ''},
        addressDetail: {type: String, default: ''},
        recipient: {type: String, default: ''},
        isSelected: {type: Boolean, default: false}
    },
    {
        timestamps: true,
    })

const ShippingAddressModel = mongoose.model('ShippingAddress', ShippingAddress, 'ShippingAddress');

export default ShippingAddressModel;