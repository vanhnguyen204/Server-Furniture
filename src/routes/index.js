import auth from "./auth.js";
import product from "./product.js";
const route = (app) => {
    app.use('/api/auth', auth);
    app.use('/api/product', product)
}

export default route;
