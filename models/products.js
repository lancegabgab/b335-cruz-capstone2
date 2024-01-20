const mongoose = require ("mongoose");

const productSchema = new mongoose.Schema ({

	name: {
		type: String,
		required: [true, "Name is required"]
	},
	description: {
		type: String,
		required: [true, "Description is required"]
	},

	price:{
		type:Number,
		required: [true, `price is Required`]
	},	

	createdOn:{
		type: Date,
		default: Date.now 
	},
	isActive:{
		type:Boolean,
		default: true 
}
});
module.exports = mongoose.model("Product", productSchema);