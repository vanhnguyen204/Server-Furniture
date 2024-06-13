import { passWord } from '../../constants/infor.js';
import User from '../models/User.js'
import bcrypt from 'bcrypt'
const AuthController = {
    async getInforUser(req, res, next) {
        console.log('get infor user')
        try {
            const { _id } = req.body.user;
            const ressponse = await User.findOne({ _id: _id })
            console.log(ressponse)
            return res.status(200).json({
                data: {
                    name: ressponse.name,
                    email: ressponse.email,
                    avatar: ressponse.avatar,
                    codeResetPass: '',
                    password: '',
                }
            })
        } catch (error) {
            next(error)
        }
    },
    async login(req, res, next) {
        console.log('Login')
        console.log(req.body)
        try {
            const result = await User.findByCredentials(req.body.email, req.body.passWord);
            if (result.error) {
                return res.status(404).json({
                    status: 404,
                    cause: result.error,
                    message: "Không thể đăng nhập lúc này."
                });
            }
            const token = await result.generateAuthToken();
            result.passWord = ""
            result.token = token
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
    ,
    async register(req, res, next) {
        console.log('Sign up');
        console.log(req.body)
        try {
            const salt = await bcrypt.genSalt(10);
            const checkUserIsEmpty = await User.findOne({ email: req.body.email });
            if (checkUserIsEmpty) {

                console.log('Tài khoản đã tồn tại')
                return res.status(400).json({ message: 'Tài khoản đã tồn tại.', status: 400 })
            }
            const hashedPassword = await bcrypt.hash(req.body.passWord, salt);

            const user = new User({
                email: req.body.email,
                passWord: hashedPassword,
                name: req.body.name
            });

            const newUser = await user.save();
            if (newUser) {
                console.log('create account successfully');
            }
            res.status(201).json({ message: 'Create account success!.', status: 201 });
        } catch (error) {
            next(error);
        }
    },
    async updateInfor(req, res, next) {
        console.log('Update infor user')
        try {
            const { _id } = req.body.user;
            const { name, password } = req.body;
            console.log(req.body)
            if (name) {
                console.log('UPDATE name: ', name)
                await User.updateOne({ _id: _id, name: name });
                return res.status(200).json({ message: 'Update success!', status: 200 });
            }
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                console.log('UPDATE PASS WORD ', password)
                await User.updateOne({ _id: _id, passWord: hashedPassword });
                return res.status(200).json({ message: 'Update success!', status: 200 });
            }


        } catch (error) {
            next(error)
        }
    },
    async handleUploadAvatar(req, res, next) {
        console.log('Upload avatar');
        try {
            const { _id } = req.body.user;
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded', status: 400 });
            }
            console.log(req.file);

            const image = '/images/' + req.file.originalname; // Update this according to your file handling logic
            await User.updateOne({ _id: _id }, { avatar: image });

            return res.status(200).json({data: { message: 'Upload avatar success.', status: 200, newAvatar: image }});
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
