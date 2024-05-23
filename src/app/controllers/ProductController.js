import Product from "../models/Product.js";

class ProductController {
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
            const { userId } = req.body;
            const productRes = await Product.find({ userId: userId });
            if (productRes.length > 0) {
                return res.status(200).json(productRes);
            } else {
                return res.json({ message: 'User do not have any product!' });
            }
        } catch (error) {
            next(error)
        }
    }

    async createProduct(req, res, next) {
        const {
            name,
            price,
            description,
            type,
            userId
        } = req.body;
        const image = '/images/' + req.file.originalname;
        const newProduct = new Product();
        newProduct.name = name;
        newProduct.price = Number(price);
        newProduct.description = description;
        newProduct.image = image;
        newProduct.type = type;
        newProduct.userId = userId;
        const createProductRes = await newProduct.save();
        if (!createProductRes) {
            res.status(400).json({ message: 'Create new product failed!' });
        }
        return res.status(201).json({ message: 'Create new product successfully!' })
    }

    async deleteProduct(req, res, next) {
        const { id } = req.body;
        const dlProductRes = Product.deleteOne({ _id: id });
        if (!dlProductRes) {
            return res.status(404).json({ message: 'Can not delete product right now, please try again!' })
        }
        return res.status(200).json({ message: 'Delete product successfully!' })
    }

    async productDetails(req, res, next) {
        const { productId } = req.body;
        const responseFind = Product.find({ _id: productId });
        if (!responseFind) {
            return res.status(404).json({ message: 'Product not found!' });
        }
        return res.status(200).json(responseFind);
    }

    async updateProduct(req, res, next) {
        const {
            name,
            price,
            description,
            id,
            type,
            userId,
            imageUpdate
        } = req.body;
        let image = '';
        if (!imageUpdate) {
            image = '/images/' + req.file.originalname;
        } else {
            image = imageUpdate;
        }

        const findProduct = Product.find({ _id: id });
        if (!findProduct) {
            return res.status(404).json({ message: 'Product not found to update!' })
        }
        const updateProduct = new Product();
        updateProduct.name = name;
        updateProduct.price = price;
        updateProduct.description = description;
        updateProduct.image = image;
        updateProduct.type = type;
        const createProductRes = await updateProduct.updateOne({ _id: id });
        if (!createProductRes) {
            res.status(400).json({ message: 'Create new product failed!' });
        }
        return res.status(201).json({ message: 'Create new product successfully!' })
    }
}

export default new ProductController;