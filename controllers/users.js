const User = require("../models/users");
const Cart = require('../models/cart'); //cart Schema
const Order = require('../models/order'); //order Schema
const Product = require('../models/products');
const bcrypt = require("bcrypt");
const auth = require("../auth");

module.exports.registerUser = (req,res) => {

    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
                //bcrypt.hashSync is to hide the actual pasaword
        password: bcrypt.hashSync(req.body.password, 10),
        mobileNo: req.body.mobileNo,
        isAdmin : req.body.isAdmin
    })
    if(req.body.mobileNo.length !== 11){
        return res.status(404).send({error: "Your number is not 11 digits"})
    }
    if(!req.body.email.includes("@")){
        return res.status(404).send({error: "Your email does not include @ character"})
    }
    if(req.body.password.length < 8){
        return res.status(404).send({error: "Your password must compose of atleast 8 characters"})
    }

    return newUser.save()
    .then((user) => res.status(201).send({ message: "Registered Successfully"}))
    .catch(err => {
    console.error("Error in register", err)
    return res.status(500).send({error: 'Email is duplicated.'});
    })
}

//loginUser process
module.exports.loginUser = (req,res) => {

    return User.findOne ({email: req.body.email})
    .then((result) => {
        if(result == null) {
            return res.status(404).send({ error: "No Email Found" });
        }
        else {
            //verify password
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password); // true or false

            if (isPasswordCorrect == true) {
                //if the password matches, the paplication server will create/generate a token.
                    return res.status(200).send({ access : auth.createAccessToken(result)})
                } else {
                    //if the password does not match, it should response that it does not match "Email and password do not match".
                    return res.status(401).send({ message: "Email and password do not match" })
                }
        }
    })
            .catch(err => {
             console.error("Error in logging in", err)
             return res.status(500).send({error: 'Cannot log in.'});
        })
}

//Retrive all users (for admin only)
module.exports.getAllUsers = (req,res) => {
    return User.find ({})
    .then (result => {
        res.status(200).send({result})
    })
    .catch(err => {
             console.error("Error in getting all info", err)
             return res.status(500).send({error: 'Failed to get details of user.'});
    })

}

module.exports.getProfile = (req,res) =>{
    return User.findById(req.user.id)
    .then (result => {
        if (result){
            result.password = "";
            res.status(200).send(result)
        }

    })
    .catch(err => {
             console.error("Error in getting all info", err)
             return res.status(500).send({error: 'Failed to get details of user.'});
    })
}

module.exports.resetPassword = async (req, res) => {
  try {
    const newPassword = { password : bcrypt.hashSync(req.body.newPassword, 10)};

    // Updating the user's password in the database
    await User.findByIdAndUpdate(req.user.id, newPassword );

    // Sending a success response
    res.status(200).send({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};



module.exports.updateAdmin = (req, res) => {
  const { userId } = req.params;

  // Check if the requesting user is an admin
  if (!req.user.isAdmin) {
    return res.status(403).send({ message: 'Permission denied. Only admins can update user roles.' });
  }

  // Update the user's role to admin
  User.findByIdAndUpdate(userId, { isAdmin: true })
    .then(() => {
      res.status(200).send({ message: 'User role updated successfully.' });
    })
    .catch((error) => {
      console.error('Error updating user role:', error);
      res.status(500).send({ message: 'Failed to update user role.' });
    });
};


// Create Order for Authenticated User
module.exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Retrieve order details from the request body
    // You may pass additional details such as shipping information, payment method, etc., as needed
    const { items, total, /* other order details */ } = req.body;

    const newOrder = new Order({
      user: userId,
      items,
      total,
      // Include other order details if needed
    });

    // Save the new order
    await newOrder.save();

    res.status(201).send({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error in creating order for authenticated user:', error);
    res.status(500).send({ error: 'Failed to create order' });
  }
};

// Retrieve All Orders for Authenticated User
module.exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Retrieve all orders for the authenticated user
    const userOrders = await Order.find({ user: userId });

    res.status(200).send({ orders: userOrders });
  } catch (error) {
    console.error('Error in retrieving all orders for authenticated user:', error);
    res.status(500).send({ error: 'Failed to retrieve orders' });
  }
};

// Retrieve All Users' Orders (Admin Only)
module.exports.getAllUsersOrders = async (req, res) => {
  try {
    // Verify the JWT token and check if the user is an admin
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, config.secret); // Make sure to replace with your actual secret

    if (!decodedToken.isAdmin) {
      return res.status(403).send({ error: 'Permission denied. Only admins can retrieve all users\' orders.' });
    }

    // Retrieve all orders for all users
    const allUsersOrders = await Order.find({});

    res.status(200).send({ orders: allUsersOrders });
  } catch (error) {
    console.error('Error in retrieving all users\' orders (admin):', error);
    res.status(500).send({ error: 'Failed to retrieve orders' });
  }
};