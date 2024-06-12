import express from 'express'
import AuthController from "../app/controllers/AuthController.js";
import { authMiddleware } from '../middleware/auth.js';
const route = express.Router();

route.get('/infor', authMiddleware, AuthController.getInforUser);
route.patch('/user', authMiddleware, AuthController.updateInfor);
route.post('/register', AuthController.register);
route.post('/login', AuthController.login)

export default route;
