import { response } from "express";
import Favorite from "../models/Favorite.js";
import Product from "../models/Product.js";
class FavoriteController {
   async createFavorite(req, res, next) {
    console.log('Create favorite--------')
       try {
        const { productId } = req.body;
        const {_id} = req.body.user;

        const newFavorite = new Favorite({ userId: _id, productId: productId });
        const response = await newFavorite.save();

        res.status(201).json(newFavorite);
        console.log(response);
       } catch (error) {
        next(error)
       }

    }

    async deleteFavorite(req, res, next) {
        console.log('Remove favorite------');
        try {
            const { _id } = req.body.user;
            const {productId} = req.params
            const favoriteResponse = await Favorite.deleteOne({ userId: _id, productId: productId })
            console.log(favoriteResponse)
            res.status(200).json({ message: 'Remove product out of list favorites' });
        } catch (error) {
            next(error)
            res.json({ message: 'Error when deleting favorite', error: error })
        }

    }

    async checkIsFavorite(req, res, next) {
        const { _id } = req.body.user;
        const { productId } = req.params
        console.log('Checking favorite')
        const favoriteResponse = await Favorite.findOne({ userId: _id, productId: productId });
    
        if (!favoriteResponse) {
            return res.status(404).json({ status: 404, message: 'Đây không phải là sản phẩm yêu thích của bạn.', cause: 'Bạn chưa thích sản phẩm này.' })
        }
        const fetchProductIsFavorite = await Product.findOne({_id: favoriteResponse.productId});
        if (!fetchProductIsFavorite) {
            return res.status(404).json({ status: 404, message: 'Không tìm thấy sản phẩm bạn đã yêu thích.', cause: 'Chủ sở hữu có lẽ đã gỡ bỏ sản phẩm này.' })
        }
        console.log('This product is favorite of ', req.body.user.email)
        return res.status(200).json(fetchProductIsFavorite)

    }

    async fetchFavorite(req, res, next) {
        try {
            const { _id, email } = req.body.user
            console.log('Get favorite by ', email)

            const favoriteResponse = await Favorite.find({ userId: _id });
            if (favoriteResponse.length === 0) {
                return res.json({ message: "Không tìm thấy sản phẩm yêu thích nào.", status: 404, cause: 'Bạn chưa thích sản phẩm nào.' })
            }
            const filterProductId = favoriteResponse.map(item => {
                return item.productId;
            })

            const productResponse = await Product.find({ _id: { $in: filterProductId } })

            return res.json(productResponse);
        } catch (e) {
            next(e)
        }

    }

}

export default new FavoriteController();