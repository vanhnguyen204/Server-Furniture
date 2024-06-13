import Product from "../models/Product.js";

class ProductController {
    async getProductByCategory(req, res, next) {
        console.log('Get product by category')

        try {
            const { category } = req.params;
            if (category === 'popular') {
                const response = await Product.find({  })
                return res.json(response)
            }
            const response = await Product.find({ type: category })
            return res.json(response)
        } catch (error) {
            next(error)
        }

    }
    async getAllProduct(req, res, next) {
        console.log('Get product');
        try {
            const productRes = await Product.find({});
            if (productRes.length > 0) {
                console.log('Get product success!');

                return res.status(200).json(productRes);
            } else {
                return res.json({ message: 'List of product is empty!' })
            }
        } catch (error) {
            next(error)
        }
    }
    async getProductOfUser(req, res, next) {

        try {
            const { _id } = req.body.user
            const { userId } = req.body;
            const productRes = await Product.find({ userId: _id });
            if (productRes.length > 0) {
                return res.status(200).json(productRes);
            } else {
                return res.status(400).json({ message: 'User do not have any product!' });
            }
        } catch (error) {
            next(error)
        }
    }

    async createProduct(req, res, next) {
        console.log('Create product.');
        try {
            const { _id } = req.body.user
            const {
                name,
                price,
                description,
                type,
            } = req.body;
            console.log(req.body);
            const image = '/images/' + req.file.originalname;
            const newProduct = new Product();
            newProduct.name = name;
            newProduct.price = Number(price);
            newProduct.description = description;
            newProduct.image = image;
            newProduct.type = type;
            newProduct.userId = _id;
            const createProductRes = await newProduct.save();
            if (!createProductRes) {
                res.status(400).json({ message: 'Create new product failed!', status: 400 });
            }
            return res.status(201).json({ message: 'Create new product successfully!', status: 201, newProduct })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async deleteProduct(req, res, next) {
        const { productId } = req.params;
        const dlProductRes = await Product.deleteOne({ _id: productId });
        if (!dlProductRes) {
            return res.status(404).json({ message: 'Can not delete product right now, please try again!', status: 404 })
        }
        return res.status(200).json({ message: 'Delete product successfully!', status: 200 })
    }

    async productDetails(req, res, next) {
        try {
            const { productId } = req.params;
            console.log("Product detail--------");
            const response = await Product.findOne({ _id: productId });
            console.log(response);
            if (!response) {
                return res.status(404).json({ message: 'Product not found!' });
            }
            return res.status(200).json(response);
        } catch (error) {
            next(error)
        }
    }

    async updateProduct(req, res, next) {
        try {
            console.log('Update product.')
        
            const {
                name,
                price,
                description,
                productId,
                type,
                imageUpdate
            } = req.body;
            let image = '';
            if (!imageUpdate) {
                image = '/images/' + req.file.originalname;
            } else {
                image = imageUpdate;
            }
            console.log(req.body);
            const findProduct = await Product.findOne({ _id: productId });
            if (!findProduct) {
                return res.status(404).json({ message: 'Product not found to update!' })
            }
            console.log(findProduct);
            findProduct.name = name;
            findProduct.price = price;
            findProduct.description = description;
            findProduct.image = image;
            findProduct.type = type;
            await Product.updateOne({ _id: productId }, findProduct)

            return res.status(200).json({ message: 'Update product successfully!', status: 200 })
        } catch (error) {
            next(error)
        }
    }
    async search(req, res, data) {
        try {
            const { productName } = req.params;
            const regex = new RegExp(productName, 'i');
            if (productName === '') {
                return res.json([])
            }
            const response = await Product.find({ name: { $regex: regex } })
            return res.json(response)
        } catch (error) {

        }
    }

    socketNotification(socket, io) {
        console.log('A user connected');
        socket.on('welcome', (chat) => {
            console.log(chat);
            io.emit('welcome', chat)
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    }
}

export default new ProductController;