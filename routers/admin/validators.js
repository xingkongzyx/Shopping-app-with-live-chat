// Put all validators inside this file

const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");
module.exports = {
	/* FIRST THREE VALIDATIONS ARE USED FOR SIGNUP PAGE */
	// check(property), validator会从req.body中寻找对应的property
	requireEmail: check("email")
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage("Must be a valid email")
		.custom(async email => {
			// Check if user already signs up with this email
			const existingUser = await usersRepo.getOneBy({ email });

			if (existingUser) {
				// If already signing up with this email
				throw new Error("Email in use");
			} else {
				return true;
			}
		}),
	requirePassword: check("password")
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage("Must be between 4 and 20 characters"),
	requirePasswordConfirmation: check("passwordConfirmation")
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage("Must be between 4 and 20 characters")
		// 通过{req}参数可以提取req.body中的properties
		.custom((passwordConfirmation, { req }) => {
			const { password } = req.body;
			// Check if password and passwordConfirmation are same
			if (password !== passwordConfirmation) {
				throw new Error("Password must match");
			} else {
				return true;
			}
		}),

	/* FOLLOWING TWO VALIDATIONS ARE USED FOR SIGNIN PAGE */
	confirmEmail: check("email")
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage("Must provide a valid email")
		.custom(async email => {
			// 验证邮箱是否存在
			const user = await usersRepo.getOneBy({ email });
			if (!user) {
				// 扔出error是告诉validation有错误的标志,之后可以使用
				// const errors = validationResult(req)去提取error
				throw new Error("Email not found");
			} else {
				return true;
			}
		}),
	confirmPassword: check("password")
		.trim()
		.custom(async (password, { req }) => {
			// 得到我们想要登录的user
			const user = await usersRepo.getOneBy({
				email: req.body.email
			});
			// 由于check("password")无论如何都会运行,不能保证user一定存在
			if (!user) {
				throw new Error("Password not match!");
			}
			// 输入的密码与user存储的密码比较
			const isValid = await usersRepo.comparePasswords(
				user.password,
				password
			);
			if (!isValid) {
				throw new Error("Password not match!");
			} else {
				return true;
			}
		}),
	requireTitle: check("title")
		.trim()
        .isLength({ min: 2, max: 40 })
        .withMessage("Must be between 2 and 40 characters"),
	requirePrice: check("price")
		.trim()
		.toFloat()
		// 且float number最小值为1
        .isFloat({ min: 1 })
        .withMessage("Must be a number greater than 1")
};
