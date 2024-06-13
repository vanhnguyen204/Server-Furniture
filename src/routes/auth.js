import express from 'express'
import AuthController from "../app/controllers/AuthController.js";
import { authMiddleware } from '../middleware/auth.js';
import upload from "../config/common/upload.js";
const route = express.Router();

route.get('/infor', authMiddleware, AuthController.getInforUser);
route.put('/user', authMiddleware, AuthController.updateInfor);
route.post('/register', AuthController.register);
route.post('/login', AuthController.login)
route.post('/user/avatar', upload, authMiddleware, AuthController.handleUploadAvatar)

export default route;
