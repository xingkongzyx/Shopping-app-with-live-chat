// 所有人都可以看到的products list,与admin中只可以登录用户看到的不同
// 所以不要与admin/products.js搞混, 这个文件是面向所有用户都可以看的shopping list
// admin/products.js是面向登陆后的用户进行products list浏览
const express = require("express");
const router = new express.Router();
const productsRepo = require("../repositories/products")
const productsIndexTemplate = require("../views/products/index")

// root handler
router.get("/", async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({products}))
});

module.exports = router;
