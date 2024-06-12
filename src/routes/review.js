import express from "express";
import ReviewController from "../app/controllers/ReviewController.js";
import { authMiddleware } from "../middleware/auth.js";
const route = express.Router();
route.get('/count/:productId', authMiddleware, ReviewController.countRatingAndReviewOfProduct)
route.get('/details/:productId', authMiddleware, ReviewController.ratingDetails)
route.get('/:productId', authMiddleware, ReviewController.isReview);
route.get('/', authMiddleware, ReviewController.getMyReview);
route.post('/', authMiddleware, ReviewController.createReview);

export default route;