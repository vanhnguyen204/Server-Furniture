import express from "express";
import ShippingAddressController from "../app/controllers/ShippingAddressController.js";
import upload from "../config/common/upload.js";
import { authMiddleware } from "../middleware/auth.js";
const route = express.Router();
route.post('/active', authMiddleware, ShippingAddressController.activeShippingAddress)
route.get('/', authMiddleware, ShippingAddressController.getMyShippingAddress);
route.post('/', authMiddleware, ShippingAddressController.create);
route.delete('/', authMiddleware, ShippingAddressController.delete);
route.patch('/', authMiddleware, ShippingAddressController.update);
export default route;