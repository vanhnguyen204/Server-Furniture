import Cart from "../models/Cart.js";
import Product from "../models/Product.js"
class CartController {
    async fetchDataFromCart(req, res, next) {
        console.log('Fetch my cart')
        try {
            const { _id } = req.body.user;
            const response = await Cart.find({ userId: _id });
            console.log(req.body)
            if (response.length == 0) {
                console.log(response)
                return res.status(200).json({ status: 404, message: 'Your cart is empty!' })
            }
            const filterProductId = response.map(item => {
                return item.productId
            })
            const responseFetchProduct = await Product.find({ _id: { $in: filterProductId } })
            const asignQuantity = responseFetchProduct.map((item, index) => {
                for (let i = 0; i < response.length; i++) {

                    if (item._id.toString() === response[i].productId) {
                        item.quantity = response[i].quantity
                        const newItem = { ...item._doc, quantity: response[i].quantity }
                        return newItem
                    }
                }
            })

            console.log('Fetch my cart success!')
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
        try {
            const { _id: userId } = req.body.user;
            const productIds = req.body.filter(item => typeof item === 'string');

            const updateCart = async (productId) => {
                const cartItem = await Cart.findOne({ productId, userId });
                if (cartItem) {
                    await Cart.updateOne(
                        { productId, userId },
                        { $set: { quantity: cartItem.quantity + 1 } }
                    );
                } else {
                    const newItem = new Cart({ userId, productId, quantity: 1 });
                    await newItem.save();
                }
            };
            await Promise.all(productIds.map(updateCart));

            return res.status(200).json({ message: "All products added to cart", status: 200 });
        } catch (error) {
            next(error);
        }
    }


    async addToCart(req, res, next) {
        console.log('Add product to cart')
        try {
            const { _id } = req.body.user;


            const { productId, quantity } = req.body;
            console.log(req.body)
            const parseQuantity = !quantity ? 1 : Number(quantity)
            const checkProductIsEmpty = await Cart.findOne({ productId: productId })
            console.log('Chechking')
            console.log(checkProductIsEmpty);
            if (checkProductIsEmpty) {

                await Cart.updateOne({
                    _id: checkProductIsEmpty._id.toString(),
                    productId: productId
                },
                    { quantity: parseQuantity + checkProductIsEmpty.quantity })

                return res.status(200).json({ message: 'Update quantity of product successfully.', status: 200 })

            }
            const newData = new Cart({
                userId: _id,
                productId: productId,
                quantity: parseQuantity,
            })
        
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
            const { productId } = req.params

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