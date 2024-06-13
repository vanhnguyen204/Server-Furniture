import express from "express";
import ProductController from "../app/controllers/ProductController.js";
import upload from "../config/common/upload.js";
import { authMiddleware } from "../middleware/auth.js";
const route = express.Router();
route.delete('/:productId', ProductController.deleteProduct);
route.post('/', upload, authMiddleware, ProductController.createProduct);
route.put('/', upload, ProductController.updateProduct);
route.get('/details/:productId', authMiddleware, ProductController.productDetails);
route.get('/search/:productName', ProductController.search)
route.get('/my-product', authMiddleware, ProductController.getProductOfUser);
route.get('/categories/:category', authMiddleware, ProductController.getProductByCategory)
route.get('/', ProductController.getAllProduct);


export default route;