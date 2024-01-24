//required node modules
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");


//port
const port = 4000;

const cors = require("cors");
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//database connection
mongoose.connect("mongodb+srv://admin:admin@lancegabgab.hdzgoli.mongodb.net/CAPSTONE_ShopeeYan", 
	{
		useNewUrlParser: true, // For parsing/reading connection string
		useUnifiedTopology: true	// Assures that our application uses mongodb latest servers when connecting with mongo database
	});
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

//for Deployed in AWS routes

app.get("b4", (req, res) => {
res.send("Hello world")
})

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);


//this is the routes for testing the not Deployed in AWS version
/*
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
*/

app.listen(port, () => {
	console.log(`Port is running at ${port}`)
})

