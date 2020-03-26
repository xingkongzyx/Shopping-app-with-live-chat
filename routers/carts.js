const express = require("express");
const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartShowTemplate = require("../views/carts/show");
const router = express.Router();

// POST request: add an item to a cart
router.post("/cart/products", async (req, res) => {
	let cart;
	// 针对于现在正在访问的user的cart是否存在
	if (!req.session.cartId) {
		// Do not have a cart, need to create one
		// And store cartid on the req.seesion.cartId
		cart = await cartsRepo.create({ items: [] });
		req.session.cartId = cart.id;
	} else {
		// Already have a cart, get it from repo
		cart = await cartsRepo.getOne(req.session.cartId);
	}

	const existingItem = cart.items.find(item => {
		return item.id === req.body.productId;
	});

	if (existingItem) {
		// 如果product存在，则升级数量
		existingItem.quantity += 1;
	} else {
		// 如果product不存在，则添加进products array
		cart.items.push({ quantity: 1, id: req.body.productId });
	}
	// 将上面的变化后的record进行保存, 想要对item array进行update
	await cartsRepo.update(cart.id, { items: cart.items });
	res.redirect("/cart");
});
// GET request: show all items in the cart
router.get("/cart", async (req, res) => {
	if (!req.session.cartId) {
		// 如果访问此route的用户没有与其对应的cart
		res.redirect("/");
	}
	// 如果存在，取得此cart
	const cart = await cartsRepo.getOne(req.session.cartId);
	// console.log(cart);
	for (let item of cart.items) {
		// 得到items array中每个item对应的实际的product
		const product = await productsRepo.getOne(item.id);
		// 将product obj attatch 到item上，只要我们不进行保存，就不会影响我们carts
		item.product = product;
	}
	res.send(cartShowTemplate({ items: cart.items }));
});

// POST request: delete an item form the cart
router.post("/cart/products/delete", async (req, res) => {
	// retrieve the cart
	const cart = await cartsRepo.getOne(req.session.cartId);

	// 使用filter method得到不等于要移除的item的其余items
	const items = cart.items.filter(item => item.id !== req.body.itemId);
	// 更新删除特定item后的cart
	await cartsRepo.update(cart.id, { items });
	res.redirect("/cart");
});

module.exports = router;
