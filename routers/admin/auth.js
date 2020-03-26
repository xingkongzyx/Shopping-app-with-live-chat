const express = require("express");
const { handleErrors } = require("./middlewares");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	confirmEmail,
	confirmPassword
} = require("./validators");

// An onject keep track of all route handlers
// Then link it with app of index.js
const router = express.Router();

router.get("/signup", (req, res) => {
	res.send(signupTemplate({}));
});

// 接收表格
// bodyParser.urlencoded({extended: true})是专门用于接收表格数据的
router.post(
    "/signup",
    // use express validator property
	[requireEmail, requirePassword, requirePasswordConfirmation],
	handleErrors(signinTemplate),
	async (req, res) => {
		// destructure the info
		const { email, password } = req.body;

		// Create an user in our user repo to represent this person
		const user = await usersRepo.create({ email, password });
		// Store the id of that user inside users cookies
		// req.session是因为cookie library才存在的, req.session==={}
		// 我们添加的任何信息都会被cookie session保持
		req.session.userID = user.id;
		res.redirect("/admin/products");
	}
);

// 注销用户
router.get("/signout", (req, res) => {
	// 使cookie为null
	req.session = null;
	res.send("signed out");
});

// 登录用户
router.get("/signin", (req, res) => {
	res.send(signinTemplate({}));
});

router.post(
	"/signin",
	[confirmEmail, confirmPassword],
	handleErrors(signinTemplate),
	async (req, res) => {
		// req.body includes all information user entered in the form
		const { email } = req.body;

		const user = await usersRepo.getOneBy({ email });

		// 登录成功-设置cookie使我们的用户被认为是被验证过的
		req.session.userID = user.id;
		res.redirect("/admin/products");
	}
);

module.exports = router;
