import User from '../models/User.js'
import bcrypt from 'bcrypt'
const AuthController = {
    async login(req, res, next) {
        console.log('Login')
        console.log(req.body)

        try {
            const result = await User.findByCredentials(req.body.email, req.body.passWord);
            if (result.error) {
                return res.json({ error: result.error });
            }
            const token = await result.generateAuthToken();
            res.status(200).json({ user: result, token });
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
            const checkUserIsEmpty = await User.findOne({email: req.body.email});
            if (checkUserIsEmpty) {
                console.log(checkUserIsEmpty);
                return res.json({error: 'Tài khoản đã tồn tại.'})
            }
            const hashedPassword = await bcrypt.hash(req.body.passWord, salt);

            const user = new User({
                email: req.body.email,
                passWord: hashedPassword
            });

            const newUser = await user.save();
            const token = await newUser.generateAuthToken();
            res.status(201).send({ user: newUser, token });
            if (newUser) {
                console.log('create account successfully');
            }
        } catch (error) {
            next(error);
        }
    }

}

export default AuthController;
