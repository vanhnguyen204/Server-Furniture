import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Favorite = new Schema({
        userId: {type: String, default: ''},
        productId: {type: String, default: ''},
    },
    {
        timestamps: true
    })


const FavoriteModel = mongoose.model('Favorite', Favorite, 'Favorite');

export default FavoriteModel;