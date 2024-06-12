import Review from "../models/Review.js";
import Product from '../models/Product.js'
import UserModel from "../models/User.js";

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
        console.log('Creating review')
        try {
            const { _id } = req.body.user;
            const { productId, rate, comment } = req.body;
    
            const now = new Date();
            const timeNowFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
            const newReview = new Review({ productId, rate, userId: _id, comment, time: timeNowFormatted });
            await newReview.save();
    
            res.status(201).json({ message: 'Create review success!', status: 201 });
        } catch (error) {
            next(error);
        }
    }
    

    async countRatingAndReviewOfProduct(req, res, next) {
        console.log('Count reviews')
        try {
            const { productId } = req.params;
            const response = await Review.find({ productId: productId });

            const filterStar = response.map(item => {
                return item.rate;
            })
            let sum = 0;
            console.log(filterStar)

            for (let i = 0; i < filterStar.length; i++) {
                sum += filterStar[i]

            }

            const averageRating =  calculateAverageRating(filterStar)
            return res.status(200).json({ averageRating: averageRating, reviews: filterStar.length })
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
            next(error)
        }
    }
    async ratingDetails(req, res, next) {
        console.log('Get rating detail')
        try {
            const {productId} = req.params
            const getReviewsOfProduct = await Review.find({productId: productId});
            const filterUserIds = getReviewsOfProduct.map(item => {
                return item.userId
            })
            const users = await UserModel.find({_id: {$in: filterUserIds}});
            const filterInforUser = users.map(item => {
                return {
                    userId: item._id.toString(),
                    avatar: item.avatar,
                    name: item.name,
                }
            })
            const assignInfor = getReviewsOfProduct.map(item => {
                for (let i = 0; i < filterInforUser.length; i++) {
                    console.log(filterInforUser)
                    if (item.userId === filterInforUser[i].userId) {
                    return {
                        ...item._doc,
                        ...filterInforUser[i]
                    }
                    }
                    
                }
            })
            console.log(assignInfor)
            res.status(200).json(assignInfor)
        } catch (error) {
            next(error)
        }
    }
}


function calculateAverageRating(ratingsArray) {
    // Khởi tạo đối tượng để đếm số lượng đánh giá cho từng mức sao
    const ratingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    // Đếm số lượng đánh giá cho từng mức sao
    ratingsArray.forEach(rating => {
      ratingsCount[rating]++;
    });
  
    // Tính tổng số lượng đánh giá
    const totalRatings = ratingsArray.length;
  
    // Tính tổng số điểm có trọng số của các đánh giá
    const weightedSum = (5 * ratingsCount[5]) + (4 * ratingsCount[4]) + (3 * ratingsCount[3]) + (2 * ratingsCount[2]) + (1 * ratingsCount[1]);
  
    if (totalRatings === 0) {
      return 0; // Tránh chia cho 0
    }
  
    // Tính điểm trung bình
    const averageRating = weightedSum / totalRatings;
    return averageRating
  }
export default new ReviewController();