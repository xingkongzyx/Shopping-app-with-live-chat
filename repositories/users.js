const crypto = require("crypto");
const Repository = require("./repository");

// 为了使用 util.promisify()
const util = require("util");
// scrypt(用于hash密码)方程的promise版本
const scrypt = util.promisify(crypto.scrypt);

class usersRepository extends Repository {
    // overwritten method
    async create(attrs) {
		// Add id property
		attrs.id = this.randomId();
		// Generate a random salt string
		const salt = crypto.randomBytes(8).toString("hex");
		// Hash password and salt, 此时scypt是promise version
		const hashedBuffer = await scrypt(attrs.password, salt, 64);
		// Generate new record with new hash password
		const record = {
			...attrs,
			password: `${hashedBuffer.toString("hex")}.${salt}`
		};
		// get most recent data in the file
		const records = await this.getAll();
		// push new record to array
		records.push(record);
		// Write the updated records back to 'filename'
		await this.writeAll(records);
		// Finally return the object with user id so that can use for cookies later
		return record;
	}

    // Used to compare password when logging in(compare hashed pass in db with user entered password) 
	// savedPass: password saved in your db, 'hashed.salt'
	// suppliedPass: password given to us by a user trying sign in
	async comparePasswords(savedPass, suppliedPass) {
		// Extract hashed psasword and salt from db
		const [oldHashedPassword, salt] = savedPass.split(".");
		// Generate new hashed password using suppliedPass
		// 注意scrypt返回一个buffer需要在比较前使用toString()
		const newHashedPasswordBuf = await scrypt(suppliedPass, salt, 64);
		// Compare two hashed passwords
		return newHashedPasswordBuf.toString("hex") === oldHashedPassword;
	}
}

module.exports = new usersRepository("users.json");
