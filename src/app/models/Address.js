import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Address = new Schema({
        country: {type: String, default: ''},
        city: {type: String, default: ''},
        district: {type: String, default: ''}
    },
    {
        timestamps: true
    })


const AddressModel = mongoose.model('Address', Address, 'Address');

export default AddressModel;