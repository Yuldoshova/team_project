import formidable from "formidable";
import { fetchData } from "../config/postgres.config.js";
import path from "path";
import fs from "fs"

const form = formidable({
    keepExtensions: true,
    uploadDir: "uploads",
});

export async function createCategory(req, res) {
    const [fields, files] = await form.parse(req);

    if (!fields.name) {
        res.send({
            status: 400,
            message: "Bad request!"
        })
        return;
    }

    const created = await fetchData(
        "INSERT INTO categories (name, image_url, category_id) VALUES ($1, $2, $3) RETURNING *",
        fields.name[0],
        files.image_url ? files.image_url[0].newFilename : null,
        fields?.category_id ? fields.category_id[0] : null
    );

    res.send({
        status: 201,
        message: "Successfully created!✅",
        data: created
    });
    return;
}

export async function getAllCategories(_, res) {
    const categories = await fetchData(
        'SELECT * FROM categories'
    );

    res.send({
        message: "Success!✅",
        data: categories,
    });
    return;
}

export async function getCategoryById(req, res) {
    const { categoryId } = req.params;
    const foundCategory = await fetchData(
        `SELECT * FROM categories WHERE id=${categoryId}`
    );

    if (foundCategory.length == 0) {
        res.send({
            status: 404,
            message: "Product not found!",
        });
        return;
    }
    res.send({
        message: "Success!✅",
        data: foundCategory,
    });
    return;
}

export async function updateCategory(req, res) {
    const { categoryId } = req.params;
    const [fields, files] = await form.parse(req);

    const foundCategory = await fetchData(
        `SELECT * FROM categories WHERE id=${categoryId}`
    );

    if (foundCategory.length == 0) {
        res.send({
            status: 404,
            message: "Product not found!",
        });
        return;
    }

    if (!fields.name || !files.image_url) {
        res.send({
            status: 400,
            message: "Bad request!"
        })
        return;
    }

    if (foundCategory[0]?.image_url) {
        fs.unlink(
            path.join(process.cwd(), "uploads", foundCategory[0]?.image_url),
            (err) => {
                if (err) {
                    console.log(err);
                }
            }
        );
    }

    const updateCategory = await fetchData(
        `UPDATE categories SET name=$1, image_url=$2, category_id=$3 WHERE id=${categoryId} RETURNING *`,
        fields.name[0],
        files.image_url[0].newFilename,
        fields.category_id ? fields.category_id[0] : null
    )

    res.send({
        status: 204,
        message: "Successfully updated!✅",
        data: updateCategory,
    });
    return;
}

export async function deleteCategory(req, res) {
    const { categoryId } = req.params;

    const foundedCategory = await fetchData(
        `SELECT * FROM categories WHERE id = ${categoryId}`
    );

    if (foundedCategory.length == 0) {
        res.status(404).send({
            message: "Category not found",
        });
        return;
    }

    if (foundedCategory[0]?.image_url) {
        fs.unlink(
            path.join(process.cwd(), "uploads", foundedCategory[0]?.image_url),
            (err) => {
                if (err) {
                    console.log(err);
                }
            }
        );
    }

    await fetchData("DELETE FROM categories WHERE id = $1", categoryId);

    res.send({
        message: "Successfully deleted!✅"
    });
    return;
}
