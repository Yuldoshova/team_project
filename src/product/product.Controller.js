const productModel = require('./product.Model');

const createProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        await productModel.createProduct(newProduct);
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = req.body;
        await productModel.updateProduct(id, updatedProduct);
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await productModel.deleteProduct(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};
