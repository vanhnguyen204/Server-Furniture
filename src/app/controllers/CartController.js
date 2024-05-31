import Cart from "../models/Cart.js";
import Product from "../models/Product.js"
class CartController {
    async fetchDataFromCart(req, res, next) {
        try {
            const { _id } = req.body.user;
            const response = await Cart.find({ userId: _id });
            if (response.length <= 0) {
                return res.status(404).json({ status: 404, message: '' })
            }
            const filterProductId = response.map(item => {
                return item.productId
            })
            const responseFetchProduct = await Product.find({ _id: { $in: filterProductId } })

            const asignQuantity = responseFetchProduct.map((item, index) => {
                if (item._id.toString() === response[index].productId) {
                    item.quantity = response[index].quantity

                    return { ...item._doc, quantity: response[index].quantity };
                }
            })
            return res.status(200).json(asignQuantity)
        } catch (error) {
            next(error)
        }
    }
    async checkProductIncludeCart(req, res, next) {
        try {
            const { _id } = req.body.user;
            const { productId } = req.body
            const response = await Cart.findOne({ productId: productId, userId: _id });

            if (response) {
                return res.status(200).json({ message: 'This product is in the cart.', status: 200 })
            } else {
                return res.status(200).json({ message: 'This product is not in the cart.', status: 202 })
            }
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
                return res.status(200).json({ message: 'Update quantity of product successfully.', status: 200 })

            }
            const newData = new Cart()
            newData.userId = _id;
            newData.productId = productId;
            newData.quantity = parseQuantity;

            await newData.save();

            return res.status(201).json({ message: 'Add product to cart successfully', data: newData, status: 201 })
        } catch (error) {
            next(error)
        }


    }

    async removeFromCart(req, res, next) {
        console.log('Remove product from cart')
        try {
            const { _id } = req.body.user;
            const { productId } = req.body

            await Cart.deleteOne({ productId: productId, userId: _id })
            console.log('Remove product from cart success')

            return res.status(200).json({ message: 'Remove product from cart success.', status: 200 })
        } catch (error) {

        }
    }
    async updateQuantityProductInCart(req, res, next) {

    }

}

export default new CartController();