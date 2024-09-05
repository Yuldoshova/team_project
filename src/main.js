import express from "express";
import { create } from "express-handlebars"
import path from "path"
import { fetchData } from "./config/postgres.config.js";
import { getAllCategories, getCategoryById, getProductsByCategoryId } from "./category/category.controller.js";
import { getProductById } from "./product/product.Controller.js";
import { categoryRoutes } from "./category/category.routes.js";

const app = express();

const hbs = create({
  extname: ".hbs",
  // defaultLayout: "main",
  layoutsDir: path.join(process.cwd(), "src", "views", "layout"),
  partialsDir: path.join(process.cwd(), "src", "views", "partial-custom")
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");


app.use("/public", express.static(path.join(process.cwd(), "src", "views", "public")));
app.use("/uploads", express.static("uploads"));

app.set("views", path.join(process.cwd(), "src", "views"))

app.use('/api/categories', categoryRoutes)

// asosiy sahifa
app.get("/", async (req, res) => {
  const categories = await getAllCategories()
  const cheapestProducts = await fetchData('SELECT * FROM products ORDER BY price ASC LIMIT 5;')
  const popularProduct = await fetchData('SELECT * FROM products ORDER BY rating DESC LIMIT 5;')

  res.render("specialCategory", { categories, cheapestProducts, popularProduct });
});

// category-product 
app.get('/categories/:categoryId', async (req, res) => {
  const { categoryId } = req.params
  const category = await getCategoryById(categoryId)
  const products = await getProductsByCategoryId(categoryId)
  res.render('category-product', { category, products })
})





// get all category
app.get('/categories', async (req, res) => {
  const { categoryId } = req.params
  const categories = await getAllCategories()
  res.render('categories', { title: "Kategoriyalar", categories })
})
// product details  
app.get('/products/:productId', async (req, res) => {
  const product = await getProductById(req.params.productId)
  res.render('product', product)
})

app.listen(4000, "localhost", console.log("listening 4000"));
