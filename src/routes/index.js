import auth from "./auth.js";
import product from "./product.js";
import favorite from "./favorite.js";
const route = (app) => {
    app.use('/api/auth', auth);
    app.use('/api/product', product);
    app.use('/api/favorite', favorite)
}

export default route;
