const pool = require('./db');
const createProduct = async (product) => {
    const { id, brend, price, rating, description, category_id, image_url } = product;
    const query = `
        INSERT INTO Product (id, brend, price, rating, description, category_id, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(query, [id, brend, price, rating, description, category_id, image_url]);
};

const getAllProducts = async () => {
    const result = await pool.query('SELECT * FROM Product');
    return result.rows;
};

const updateProduct = async (id, updatedProduct) => {
    const { brend, price, rating, description, category_id, image_url } = updatedProduct;
    const query = `
        UPDATE Product
        SET brend = $2, price = $3, rating = $4, description = $5, category_id = $6, image_url = $7
        WHERE id = $1
    `;
    await pool.query(query, [id, brend, price, rating, description, category_id, image_url]);
};

const deleteProduct = async (id) => {
    await pool.query('DELETE FROM Product WHERE id = $1', [id]);
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};
