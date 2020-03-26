// Used to handle errors after using check() method of "express-validator"
const { validationResult } = require("express-validator");

module.exports = {
	// 用于处理使用express-validator后的error问题, datacb是可选参数
	handleErrors(templateFunc, dataCb) {
		return async (req, res, next) => {
			const errors = validationResult(req);
			// If some errors during validation
			if (!errors.isEmpty()) {
				let data = {};
				// 查看datacb是否提供
				if (dataCb) {
					data = await dataCb(req);
				}
				return res.send(templateFunc({ errors, ...data }));
			}
			// If no error
			next();
		};
	},

	requireAuth(req, res, next) {
		// check if userid sesion exists or not, if not, redirect to signin
		// In sign in page. Will give it value
		if (!req.session.userID) {
			return res.redirect("/signin");
		}
		// Otherwise, call next func
		next();
	}
};
