import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Review = new Schema({
        productId: {type: String, default: ''},
        userId: {type: String, default: ''},
        rate: {type: Number, default: ''},
        comment: {type: String, default: ''},
        time: {type: String, default: ''},

    },
    {
        timestamps: true
    })


const ReviewModel = mongoose.model('Review', Review, 'Review');

export default ReviewModel;