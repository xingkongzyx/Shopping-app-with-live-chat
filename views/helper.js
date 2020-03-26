module.exports = {
	// Helper func, to see if there are some errors
	getError(errors, prop) {
		// prop === 'email','password','passwordConfirmation'
		try {
			return errors.mapped()[prop].msg;
		} catch (err) {
			return "";
		}
	}
};
