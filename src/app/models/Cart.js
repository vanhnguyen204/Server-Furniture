import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Cart = new Schema({
        userId: {type: String, default: ''},
        productId: {type: String, default: ''},
        quantity: {type: Number, default: 1}
    },
    {
        timestamps: true
    })


const CartModel = mongoose.model('Cart', Cart, 'Cart');

export default CartModel;