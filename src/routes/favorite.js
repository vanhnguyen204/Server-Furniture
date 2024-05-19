import express from "express";
const route = express.Router();
import FavoriteController from "../app/controllers/FavoriteController.js";
route.post('/create', FavoriteController.createFavorite);
route.delete('/delete', FavoriteController.deleteFavorite);
route.post('/isFavorite', FavoriteController.checkIsFavorite);
route.post('/favorites-user/:userId', FavoriteController.fetchFavorite)
export default route;