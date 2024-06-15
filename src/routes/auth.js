import express from 'express'
import AuthController from "../app/controllers/AuthController.js";
import { authMiddleware } from '../middleware/auth.js';
import upload from "../config/common/upload.js";
const route = express.Router();

route.get('/infor', authMiddleware, AuthController.getInforUser);
route.put('/user', authMiddleware, AuthController.updateInfor);
route.put('/reset-pass', AuthController.resetPass)
route.post('/register', AuthController.register);
route.post('/login', AuthController.login);
route.post('/verify-email', AuthController.verifyEmail)
route.post('/verify-code', AuthController.verifyCode)
route.post('/user/avatar', upload, authMiddleware, AuthController.handleUploadAvatar)

export default route;
