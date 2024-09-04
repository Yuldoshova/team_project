const express = require('express');
const router = express.Router();
const productController = require('./product.Controller');

router.post('/products', productController.createProduct);
router.get('/products', productController.getAllProducts);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
