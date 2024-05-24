import express from "express";
const route = express.Router();
import PaymentController from "../app/controllers/PaymentController.js";
import { authMiddleware } from "../middleware/auth.js";
route.post('/my-payment', authMiddleware, PaymentController.getPaymentOfUser)
route.post('/active', authMiddleware, PaymentController.activePayment);
route.post('/', authMiddleware, PaymentController.createPayment );
route.put('/', authMiddleware, PaymentController.updatePayment);
route.delete('/', authMiddleware, PaymentController.removePayment);
export default route;