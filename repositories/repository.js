const fs = require("fs");
const crypto = require("crypto");

// generic class that can be used to generate different repositories
module.exports = class {
	// constructor方程用于检查是否提供存储数据的file
	// constructor不允许被async
	constructor(filename) {
		if (!filename) {
			throw new Error("Creating a new repository needs a file");
		}
		this.filename = filename;

		try {
			// 使用sync version会使得我们的程序进行等待直到access完成再执行下面的code
			// 由于我们整个app只会有一个class实例所以同步version只会运行一次
			// 不会对运行速度造成大的影响
			fs.accessSync(this.filename);
		} catch (error) {
			// If the file does not exist, will create it
			fs.writeFileSync(this.filename, "[]");
		}
	}

	// Gets a list of all users/products
	async getAll() {
		// Open the file called this.filename
		const content = await fs.promises.readFile(this.filename, {
			encoding: "utf-8"
		});
		// Parse the contents from a JSON string to an array of javascript objects
		const data = JSON.parse(content);
		// Return the parsed data
		return data;
	}

	// generates a random id
	randomId() {
		// Use randomBytes得到随机四个bytes然后使用toString("hex")将其变为16进制string
		return crypto.randomBytes(4).toString("hex");
	}

	// Write all users/products to corresponding file
	async writeAll(records) {
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2)
		);
	}

	// Create an user/product with the given attributes
	async create(attrs) {
		attrs.id = this.randomId();
		const records = await this.getAll();
		records.push(attrs);
        await this.writeAll(records);
        console.log("create")
		return attrs;
	}

	// Find the user/product with given id
	async getOne(id) {
		// Get all records
		const records = await this.getAll();
		// 如果找到返回record element, 如果没找到返回undefined
		return records.find(record => {
			return record.id === id;
		});
	}

	// Delete the user/product with given id
	async delete(id) {
		const records = await this.getAll();
		// 使用filter method保留数组中与要删除的id不同的elements
		const remainingRecords = records.filter(record => record.id !== id);
		console.log(">>>>>>>>>> DELETING USER!");
		await this.writeAll(remainingRecords);
	}

	// Update the user/product with the given id, using given attributes
	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find(record => record.id === id);
		// If no such record, throw an error
		if (!record) {
			throw new Error(`Record with id ${id} not found!`);
		}
		// Update properties
		Object.assign(record, attrs);
		// Write new records to file
		await this.writeAll(records);
	}

	// Finds one user/product with the given filters
	async getOneBy(filters) {
		const records = await this.getAll();
		for (let record of records) {
			let found = true;
			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}
			// 如果比较之后found还是真的,说明匹配成功,返回相应record
			if (found) {
				return record;
			}
		}
	}
};
