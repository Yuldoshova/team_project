import { Router } from "express"
import {
   createProduct,
   deleteProduct,
   filter,
   getAllProducts,
   getProductById,
   updateProduct
} from "./product.controller.js";
export const productRoutes = Router();

productRoutes
   .get('/all', getAllProducts)
   .get('/filter', filter)
   .get('/:productId', getProductById)
   .post('/add', createProduct)
   .put('/update/:productId', updateProduct)
   .delete('/remove/:productId', deleteProduct)
