import express from "express";
import ProductController from "../app/controllers/ProductController.js";
import upload from "../config/common/upload.js";
import { authMiddleware } from "../middleware/auth.js";
const route = express.Router();
route.post('/delete', ProductController.deleteProduct);
route.post('/create',upload, ProductController.createProduct);
route.post('/update',upload, ProductController.updateProduct);
route.get('/details', authMiddleware, ProductController.productDetails);
route.get('/product-user', ProductController.getProductOfUser);
route.get('/', ProductController.getAllProduct);


export default route;