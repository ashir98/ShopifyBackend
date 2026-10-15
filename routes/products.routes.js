import express from "express";
const productRouter = express.Router();
import productController from "../controllers/product.controller.js";
import { adminProtect } from "../middlewares/admin_middleware.js";

productRouter.route("/products")
.get(productController.getAllProducts)
.post( adminProtect  , productController.addProduct) // ADMIN ONLY



productRouter.route("/products/:id")
.get(productController.getSingleProduct)
.put(  adminProtect  ,  productController.updateProduct) // ADMIN ACCESS
// .delete()



export default productRouter;



