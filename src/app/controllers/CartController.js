import Cart from "../models/Cart.js";

class CartController {
    async fetchDataFromCart(req, res, next) {
        try {
           
        } catch (error) {
            next(error)
        }
    }
    async checkProductIncludeCart(req, res, next) {
        try {
            const { _id } = req.body.user;
            const { productId } = req.body
        } catch (error) {
            next(error)
        }
    }

    async addAllToCart(req, res, next) {

    }

    async addToCart(req, res, next) {
        try {
            const { _id } = req.body.user;


            const { productId, quantity } = req.body;
            const parseQuantity = !quantity ? 1 : Number(quantity)
            const checkProductIsEmpty = await Cart.findOne({ productId: productId })
            console.log(checkProductIsEmpty);
            if (checkProductIsEmpty) {

                await Cart.updateMany({ _id: checkProductIsEmpty._id }, { quantity: parseQuantity + checkProductIsEmpty.quantity })
                return res.status(200).json({ message: 'Update số lượng sản phẩm trong giỏ hàng thành công.' })

            }
            const newData = new Cart()
            newData.userId = _id;
            newData.productId = productId;
            newData.quantity = parseQuantity;

            await newData.save();

            return res.status(201).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công.', data: newData })
        } catch (error) {
            next(error)
        }


    }

    async removeFromCart(req, res, next) {

    }
    async updateQuantityProductInCart(req, res, next) {

    }
}

export default new CartController();