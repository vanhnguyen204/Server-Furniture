import express from "express";
const route = express.Router();
import CartController from "../app/controllers/CartController.js";
import { authMiddleware } from "../middleware/auth.js";
route.post('/checking-product', authMiddleware, CartController.checkProductIncludeCart);
route.post('/add-all', authMiddleware, CartController.addAllToCart);
route.post('/add', authMiddleware, CartController.addToCart);
route.post('/remove', authMiddleware, CartController.removeFromCart);
route.post('/update-quantity', authMiddleware, CartController.updateQuantityProductInCart)
route.post('/my-cart', authMiddleware, CartController.fetchDataFromCart)
export default route;