import express from "express";
const route = express.Router();
import FavoriteController from "../app/controllers/FavoriteController.js";
import { authMiddleware } from "../middleware/auth.js";
route.post('/create', authMiddleware, FavoriteController.createFavorite);
route.post('/delete', authMiddleware, FavoriteController.deleteFavorite);
route.post('/isFavorite',authMiddleware, FavoriteController.checkIsFavorite);
route.post('/favorites-user', authMiddleware, FavoriteController.fetchFavorite)
export default route;