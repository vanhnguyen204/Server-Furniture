import express from "express";
import InvoiceController from "../app/controllers/InvoiceController.js";
import upload from "../config/common/upload.js";
import { authMiddleware } from "../middleware/auth.js";
const route = express.Router();
route.post('/', authMiddleware, InvoiceController.createInvoice)
route.get('/', authMiddleware, InvoiceController.getMyInvoice)

export default route;