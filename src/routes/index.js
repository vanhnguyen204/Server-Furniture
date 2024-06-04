import auth from "./auth.js";
import product from "./product.js";
import favorite from "./favorite.js";
import cart from "./cart.js"
import payment from "./payment.js"
import shippingAddress from './shippingAddress.js'
import address from './address.js'
import invoice from './invoice.js'
const route = (app) => {
    app.use('/api/auth', auth);
    app.use('/api/product', product);
    app.use('/api/favorite', favorite)
    app.use('/api/cart', cart)
    app.use('/api/payment', payment)
    app.use('/api/shipping-address', shippingAddress)
    app.use('/api/address', address)
    app.use('/api/invoice', invoice)
}

export default route;
