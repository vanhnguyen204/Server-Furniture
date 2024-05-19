import Favorite from "../models/Favorite.js";
import Product from "../models/Product.js";
class FavoriteController {
    createFavorite(req, res, next) {
        const { userId, productId } = req.body;
        const newFavorite = new Favorite({ userId, productId });
        newFavorite.save()
            .then(response => {
                res.status(201).json({ message: 'Added product to your list favorites.' });
            })
            .catch(e => {
                next(e)
            })

    }

    async deleteFavorite(req, res, next) {
        try {
            const { userId, productId } = req.body;

            const favoriteResponse = await Favorite.deleteOne({ userId: userId, productId: productId })
            console.log(favoriteResponse)
            res.status(200).json({ message: 'Remove product out of list favorites' });
        } catch (error) {
            next(error)
            res.json({ message: 'Error when deleting favorite', error: error })
        }

    }

    checkIsFavorite(req, res, next) {
        const { userId, productId } = req.body;
        console.log('Checking favorite')
        Favorite.findOne({ userId: userId, productId: productId })
            .then(response => {
                console.log(response)
                if (response) {
                    res.status(200).json({ isFavorite: true });

                } else {
                    res.json({ isFavorite: false })
                }
            })
            .catch(e => {
                next(e)
            })

    }

    async fetchFavorite(req, res, next) {
        console.log('Get favorite')
        console.log(req.params)
        try {
            const { userId } = req.params;
            const favoriteResponse = await Favorite.find({ userId: userId });
            if (favoriteResponse.length === 0) {
                return res.json({ message: "Bạn chưa thích sản phẩm nào!", data: [] })
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