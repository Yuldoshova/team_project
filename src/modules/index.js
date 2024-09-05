import { fetchData } from "../config/postgres.config.js";

export async function getAllCategoriesByChilds(req, res) {
    const cheapestProducts = await fetchData('SELECT * FROM products ORDER BY price ASC LIMIT 5;');
    const popularProducts = await fetchData('SELECT * FROM products ORDER BY rating DESC LIMIT 5;')
    const categories = await fetchData(
        'SELECT * FROM categories'
    );

    res.render("home", { categories, cheapestProducts, popularProducts });
}
