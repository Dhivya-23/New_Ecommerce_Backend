
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/ProductModel');
const CartService = require('../CartService/deleteCart');


const addCart = async (req, res) => {
    try {
        console.log('req.user:', req.user); 
        const user_id = req.user.id;
        const { product_id, quantity } = req.body;

        let userCart = await CartModel.findOne({ user_id });

        if (userCart) {
            const productIndex = userCart.products.findIndex(item => item.product_id === product_id);

            if (productIndex !== -1) {
                userCart.products[productIndex].quantity += quantity;
                await userCart.save();
                return res.status(200).json({ message: 'Product quantity updated in the cart.' });
            } else {
                userCart.products.push({ product_id, quantity });
                await userCart.save();
                return res.status(200).json({ message: 'Product added to the cart.' });
            }
        } else {
            userCart = new CartModel({
                user_id,
                product: [{ product_id, quantity }]
            });
            await userCart.save();
            return res.status(201).json({ message: 'Cart created and product added.' });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getCartProducts = async (req, res) => {
    try {
        const user_id = req.user.id; 

        const userCart = await CartModel.findOne({ user_id });

        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIds = userCart.products.map(item => item.product_id);

        const products = await ProductModel.find({ Id: { $in: productIds } });

        const productMap = products.reduce((acc, product) => {
            acc[product.Id] = product;
            return acc;
        }, {});
        
        let subtotal=0;

        const productsDetails = userCart.products.map(item => {
            const product = productMap[item.product_id];

            if (!product) {
                console.warn(`product not found for id: ${item.product_id}`);
                return {
                    name: 'Unknown',
                    description: 'No description available',
                    title: 'Unknown',
                    image: 'No image available',
                    price:'no price',
                    quantity: item.quantity 
                };
            }

            subtotal += product.Price * item.quantity;

            return {
                title: product.Title,
                description: product.Description,
                image: product.Image,
                price:product.Price,
                quantity: item.quantity 
            };
        });

        res.json({ productsDetails,subtotal });
    } catch (error) {
        console.error('Error fetching cart products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const deleteCart = async (req, res) => {
    try {
        await CartService.deleteCart(req.user.id, req.body.product_id);
        res.status(200).json({ message: 'Product removed from cart.' });
    } catch (error) {
        console.error('Error deleting from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports = { addCart, getCartProducts ,deleteCart};
