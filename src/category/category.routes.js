import { Router } from "express"
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "./category.controller.js";
export const categoryRoutes = Router();

categoryRoutes
   .get('/all', getAllCategories)
   .get('/:categoryId', getCategoryById)
   .post('/add', createCategory)
   .put('/update/:categoryId', updateCategory)
   .delete('/remove/:categoryId', deleteCategory)
