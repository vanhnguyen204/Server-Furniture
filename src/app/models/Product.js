import mongoose from "mongoose";

const Schema = mongoose.Schema;
const Product = new Schema({
        userId: {type: String, default: 'admin_test'},
        name: {type: String, default: ''},
        price: {type: Number, default: 0},
        description: {type: String, default: ''},
        image: {type: String, default: ''},
        type: {type: String, default: ''},
    },
    {
        timestamps: true,
    })

const ProductModel = mongoose.model('Product', Product, 'Product');

export default ProductModel;