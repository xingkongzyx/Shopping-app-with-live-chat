const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cookieSession = require("cookie-session");
const socketio = require("socket.io");
const Filter = require("bad-words");
// Inport the router
const authRouter = require("./routers/admin/auth");
const adminProductsRouter = require("./routers/admin/products");
const productsRouter = require("./routers/products");
const cartsRouter = require("./routers/carts");
const { generateMessage, generateLocationMessage } = require("./routers/utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./routers/utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: ["lkasld235j"]
	})
);
// 位置很重要在另两个app.use()后面; associate the router
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

// print a message when a new client connects
io.on("connection", socket => {
	console.log("server connection!");

	// client sends username and room, and server makes that user to join
	// listener for join
	socket.on("join", (options, callback) => {
		// 要不返回username要不返回id
		const { error, user } = addUser({ id: socket.id, ...options });
		if (error) {
			// 有错误call callback with error
			return callback(error);
		}
		// Join a room, 只能在server使用
		// 有room概念后给了我们新的一种发送event的形式，就是发送event到特定room
		socket.join(user.room);
		// Emit message in the same room
		socket.emit("message", generateMessage("Admin", "Welcome!"));

		socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined!`));

		// when user join, send a new event with all user data and room data
		// 在用户离开或加入时能够获得现在本聊天室的用户列表,便于client端显示
		io.to(user.room).emit("roomData", {
			room: user.room,
			users: getUsersInRoom(user.room)
		});
		// 一切顺利调用callback
		callback();
	});

	// Server listen for sendMessage event
	socket.on("sendMessage", (messageInput, callback) => {
		// get user data with the id
		const user = getUser(socket.id);
		// if user === undefined
		if (!user) {
			return callback("Please try again!");
		}
		const filter = new Filter();
		if (filter.isProfane(messageInput)) {
			// setup the server to send back acknowledgement and will not emit message event because of the error
			return callback("Profanity is not allowed!");
		}

		// emit message to their current room
		io.to(user.room).emit("message", generateMessage(user.username, messageInput));

		// setup the server to send back acknowledgement
		callback();
	});

	// listen for sendLocation event
	socket.on("sendLocation", ({ latitude, longitude }, callback) => {
		// get user data with the id
		const user = getUser(socket.id);
		// if user === undefined
		if (!user) {
			return callback("Please try again!");
		}
		// When fired, send an event with url to all connected clients
		io.to(user.room).emit(
			"locationMessage",
			generateLocationMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`)
		);
		// setup the server to send back acknowledgement
		callback();
	});

	// send a message when a client get disconnected
	socket.on("disconnect", () => {
		// remove user after disconnecting, result will be a removed user or undefined
		const user = removeUser(socket.id);
		// If there is a real user being removed
		if (user) {
			io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left room ${user.room}`));
			// when user leaves, send a new event with all user data and room data
			io.to(user.room).emit("roomData", {
				room: user.room,
				users: getUsersInRoom(user.room)
			});
		}
	});
});

const port = process.env.PORT || 3000;

// tell express to watch for incoming request on port 3000
server.listen(port, () => {
	console.log(`Server is connected to port ${port}!`);
});
