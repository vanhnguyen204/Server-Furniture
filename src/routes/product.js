import express from "express";
import ProductController from "../app/controllers/ProductController.js";
import upload from "../config/common/upload.js";
import { authMiddleware } from "../middleware/auth.js";
const route = express.Router();
route.post('/delete', ProductController.deleteProduct);
route.post('/create', upload, authMiddleware, ProductController.createProduct);
route.post('/update', upload, ProductController.updateProduct);
route.post('/details', authMiddleware, ProductController.productDetails);
route.get('/search/:productName', ProductController.search)
route.get('/my-product', authMiddleware, ProductController.getProductOfUser);
route.get('/categories/:category', authMiddleware, ProductController.getProductByCategory)
route.get('/', ProductController.getAllProduct);


export default route;