import express from 'express'
import AddressController from "../app/controllers/AddressController.js";
const route = express.Router();

route.post('/', AddressController.getAddress);

export default route;
