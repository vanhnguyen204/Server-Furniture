import Review from "../models/Review.js";
import Product from '../models/Product.js'

class ReviewController {
    async getMyReview(req, res, next) {
        try {
            const { _id } = req.body.user;
            const reviews = await Review.find({ userId: _id });
            const productIds = reviews.map(review => review.productId);
            const products = await Product.find({ _id: { $in: productIds } });
            const productMap = products.reduce((map, product) => {
                map[product._id] = product;
                return map;
            }, {});
            const responseReviews = reviews.map(review => {
                const product = productMap[review.productId];
                return {
                    ...product._doc,
                    rate: review.rate,
                    comment: review.comment,
                    time: review.time
                };
            });

            res.status(200).json(responseReviews);
        } catch (error) {
            next(error);
        }
    }

    async createReview(req, res, next) {
        try {
            const { _id } = req.body.user;
            const { productId,
                rate,
                comment } = req.body
            const now = new Date();
            const timeNowFormatted = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

            const newReview = new Review({ productId, rate, userId: _id, comment, time: timeNowFormatted })
            await newReview.save();
            res.status(201).json({ message: 'Create review success!', status: 201 })
        } catch (error) {
            next(error)
        }
    }

    async isReview(req, res, next) {
        console.log('Check is review');
        try {
            const { _id } = req.body.user;
            const { productId } = req.params;
            console.log(req.params);
            const responseReview = await Review.findOne({ productId, userId: _id })
            console.log(responseReview)
            if (!responseReview) {
                return res.status(200).json({ isReview: true })
            }
            return res.status(200).json({ isReview: false })
        } catch (error) {

        }
    }


}

export default new ReviewController();