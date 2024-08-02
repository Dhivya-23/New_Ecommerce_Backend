const Product = require('../models/ProductModel');
const { v4: uuidv4 } = require('uuid');
uuidv4();

const getAllProducts = async (req, res) => {
    console.log(req.userId);
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
};

const postAllProducts = async (req, res) => {
     try {
        const { Id, Title, Description, Category, Price,Image, Rating} = req.body;

        const postproduct = new Product({
            Id:uuidv4(),
            Title,
            Description,
            Category,
            Price,
            Image,
            Rating
        });

        await postproduct.save();
        res.status(201).json(postproduct);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'An error occurred while creating the product' });
    }
};

const updateProducts = async (req, res) => {
    try {
        const { Id, Title, Description, Category, Price, Image, Rating } = req.body;

        const updatedproduct = await Product.findOneAndUpdate(
            { Id:Id}, 
            { Title, Description, Category, Price, Image, Rating }, 
            { new: true }  
        );

        res.status(200).json(updatedproduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }

};

const deleteProducts=async(req,res)=>{
    try{
        const { Id } = req.body;
        const deleteproduct = await Product.findOneAndDelete({ Id:Id});
    
        res.status(200).json(deleteproduct);
    }
    
     catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'An error occurred while deleting the product' });
    }
};

module.exports = { getAllProducts, postAllProducts,updateProducts ,deleteProducts};
