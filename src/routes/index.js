import auth from "./auth.js";
import product from "./product.js";
import favorite from "./favorite.js";
import cart from "./cart.js"
import payment from "./payment.js"
const route = (app) => {
    app.use('/api/auth', auth);
    app.use('/api/product', product);
    app.use('/api/favorite', favorite)
    app.use('/api/cart', cart)
    app.use('/api/payment', payment)
}

export default route;
