// cartService/deleteCart.js

const cartModel = require('../models/cartModel');

const deleteCart = async (user_id, product_id) => {
    try {
        const user = await cartModel.findOne({ user_id });
        if (!user) {
            console.error('User not found with userId:', user_id);
            throw new Error('User not found');
        }

        if (!user.products) {
            console.error('Product field not found in user cart:', user);
            throw new Error('Product field is undefined');
        }

        user.products = user.products.filter(item => item.product_id!= product_id);
        await user.save();

        return user.products; 
    } catch (err) {
        console.error('Error in deleteCart:', err);
        throw err; 
    }
};

module.exports = { deleteCart };