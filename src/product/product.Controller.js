import formidable from "formidable";
import { fetchData } from "../config/postgres.config.js";
import path from "path";
import fs from "fs"

const form = formidable({
    keepExtensions: true,
    uploadDir: "uploads",
});

export async function createProduct(req, res) {
    const [fields, files] = await form.parse(req);

    if (!fields.title || !fields.price || !fields.count || !fields.category_id) {
        res.send({
            status: 400,
            message: "Bad request!"
        })
        return;
    }

    const created = await fetchData(
        "INSERT INTO products (title, description, price, count, rating, image_url, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        fields.title[0],
        fields.description ? fields.description[0] : null,
        fields.price[0],
        fields.count[0],
        fields.rating ? fields.rating[0] : null,
        files.image_url ? files.image_url[0].newFilename : null,
        fields.category_id[0]
    );

    res.send({
        status: 201,
        message: "Successfully created!✅",
        data: created
    });
    return;
}

export async function getAllProducts(_, res) {
    const { filter, sort, order } = req.query;

    let query = "SELECT * FROM products"
    let queryparams = [];

    if (filter) {
        query += `WHERE title ILIKE ${filter}`;
        queryparams.push(toUpperCase);
    }

    if (sort) {
        query += ` ORDER BY ${sort}`;
        if (order) {
            queryparams.push(toUpperCase);
        }
    }

    const allProducts = await fetchData(query, ...queryparams);

    res.send({
        message: "Success!✅",
        data: allProducts,
    });
    return;
}

export async function filter(req, res) {

    const allProducts = await fetchData("SELECT * FROM products ORDER BY rating DESC LIMIT 5;")

    res.send({
        message: "Success!✅",
        data: allProducts,
    });
    return;
}

export async function getProductById(req, res) {
    const { productId } = req.params;
    const foundProduct = await fetchData(
        `SELECT * FROM products WHERE id=${productId}`
    );

    if (foundProduct.length == 0) {
        res.send({
            status: 404,
            message: "Product not found!",
        });
        return;
    }
    res.send({
        message: "Success!✅",
        data: foundProduct,
    });
    return;
}


export async function updateProduct(req, res) {
    const productId = req.params.productId;
    const [fields, files] = await form.parse(req);

    const foundProduct = await fetchData(`SELECT * FROM products WHERE id=${productId}`)
    if (foundProduct.length == 0) {
        res.send({
            status: 404,
            message: "Product not found!",
        });
        return;
    }

    if (!fields.title || !fields.price || !fields.count || !fields.category_id) {
        res.send({
            status: 400,
            message: "Bad request!"
        })
        return;
    }

    if (foundProduct[0]?.image_url) {
        fs.unlink(
            path.join(process.cwd(), "uploads", foundProduct[0]?.image_url),
            (err) => {
                if (err) {
                    console.log(err);
                }
            }
        );
    }

    const updateProduct = await fetchData(
        "UPDATE products SET title=$1, description=$2, price=$3, count=$4, rating=$5, image_url=$6, category_id=$7  WHERE id=$8 RETURNING *",
        fields.title[0],
        fields.description ? fields.description[0] : null,
        fields.price[0],
        fields.count[0],
        fields.rating ? fields.rating[0] : null,
        files.image_url ? files.image_url[0].newFilename : null,
        fields.category_id[0],
        productId
    )

    res.send({
        status: 204,
        message: "Successfully updated!",
        data: updateProduct,
    });

    return;
}

export async function deleteProduct(req, res) {
    const { productId } = req.params;

    const foundProduct = await fetchData(
        `SELECT * FROM products WHERE id = ${productId}`
    );

    if (foundProduct.length == 0) {
        res.status(404).send({
            message: "Product not found",
        });
        return;
    }

    if (foundProduct[0]?.image_url) {
        fs.unlink(
            path.join(process.cwd(), "uploads", foundProduct[0]?.image_url),
            (err) => {
                if (err) {
                    console.log(err);
                }
            }
        );
    }

    await fetchData("DELETE FROM products WHERE id = $1", productId);

    res.send({
        message: "Successfully deleted!✅"
    });
    return;
}
