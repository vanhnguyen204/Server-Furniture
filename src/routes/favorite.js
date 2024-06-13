import express from "express";
const route = express.Router();
import FavoriteController from "../app/controllers/FavoriteController.js";
import { authMiddleware } from "../middleware/auth.js";
route.post('/', authMiddleware, FavoriteController.createFavorite);
route.delete('/:productId', authMiddleware, FavoriteController.deleteFavorite);
route.get('/isFavorite/:productId',authMiddleware, FavoriteController.checkIsFavorite);
route.get('/favorites-user', authMiddleware, FavoriteController.fetchFavorite)
export default route;