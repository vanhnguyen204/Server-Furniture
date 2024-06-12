import express from "express";
import InvoiceController from "../app/controllers/InvoiceController.js";
import upload from "../config/common/upload.js";
import { authMiddleware } from "../middleware/auth.js";
const route = express.Router();
route.get('/statistical/:time', authMiddleware, InvoiceController.statistical)
route.get('/details/:invoiceId', authMiddleware, InvoiceController.getInvoiceDetail)
route.post('/v2/android', authMiddleware, InvoiceController.createInvoiceAndroid)
route.post('/', authMiddleware, InvoiceController.createInvoice)
route.get('/', authMiddleware, InvoiceController.getMyInvoice)

export default route;