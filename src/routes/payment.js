import express from "express";
const route = express.Router();
import PaymentController from "../app/controllers/PaymentController.js";
import { authMiddleware } from "../middleware/auth.js";
route.get('/my-payment', authMiddleware, PaymentController.getPaymentOfUser)
route.post('/active/:paymentId', authMiddleware, PaymentController.activePayment);
route.post('/my-selected-payment', authMiddleware, PaymentController.getSelectedPayment);
route.post('/', authMiddleware, PaymentController.createPayment );
route.put('/', authMiddleware, PaymentController.updatePayment);
route.delete('/:paymentId', authMiddleware, PaymentController.removePayment);
export default route;