import { Router } from "express";
import { categoryRoutes } from "../modules/category/category.routes.js";
import { productRoutes } from "../modules/product/product.routes.js";
import { getAllCategoriesByChilds } from "../modules/index.js";

export const routes = Router()

routes.use('/home', getAllCategoriesByChilds)
routes.use('/categories', categoryRoutes)
routes.use('/products', productRoutes)