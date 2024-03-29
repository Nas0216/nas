const express = require('express');
const adminRouter = express.Router();
const admin = require ('../middlewares/admin');
const {Product} = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

// Add product

adminRouter.post('/admin/add-product', admin, async(req, res) =>{
    try {
        const {name, brand, dosageForm, strength, unit, quantity, images, batchNumber, expiryDate, cost, price, category,} = req.body;
        let product = new Product({
            name,
            brand,
            dosageForm,
            strength,
            unit,
            quantity,
            batchNumber,
            expiryDate,
            cost,
            price,
            category,
            images,
        });
        product = await product.save();
    res.json(product);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
} );
 
//update-product

adminRouter.put('/admin/update-product', admin, async (req, res) => {
    try {
        const {id,name, brand, dosageForm, strength, unit, quantity, images, batchNumber, expiryDate, cost, price, category,} = req.body;
       let product = await Product.findByIdAndUpdate(id); 
       product.name = name;
       product.brand = brand;
       product.dosageForm = dosageForm;
       product.strength = strength;
       product.unit = unit;
       product.quantity = quantity;
       if(images!=null){
       product.images  = images;
       }
       product.expiryDate = expiryDate;
       product.batchNumber = batchNumber;
       product.category = category;
       product.cost = cost;
       product.price = price;
       product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// /admin/get-products

adminRouter.get("/admin/get-products", admin, async (req, res) =>{
    try {
        const products = await Product.find({}).sort({$natural: -1});
        res.json(products);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// Delete products

adminRouter.post('/admin/delete-product', admin, async (req, res) => {
    try {
        const {id} = req.body;
        let product = await Product.findByIdAndDelete(id);
        res.json(product);
    } catch (e) {
        res.status(500).json({error: e.message});
    } 
});

// get-users

adminRouter.get('/admin/get-users', admin, async (req,res) => {
    try {
        const users = await User.find({}).sort({$natural: -1});
        res.json(users);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// get-orders

adminRouter.get('/admin/get-orders', admin, async (req,res) => {
    try {
        const orders = await Order.find({}).sort({$natural: -1});
        res.json(orders);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// change order status

adminRouter.post('/admin/change-order-status', admin, async (req, res) => {
    try {
        const { id, status } = req.body;
        let order = await Order.findById(id);
        order.status = status;
        order = await order.save();
        res.json(order);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
    
});

// analytics

adminRouter.get('/admin/analytics', admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        let totalEarnings = 0;
        let totalCosts =0;

        for(let i=0; i<orders.length; i++){
            for (let j=0; j < orders[i].products.length; j++){
                    totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product.price;
                    totalCosts += orders[i].products[j].quantity * orders[i].products[j].product.cost;
            }
        }

        // Category Wise Order Fetching

        let AntimicrobialEarnings = (await fetchCategoryWiseProduct("Antimicrobials")).earnings;
        let GIEarnings = (await fetchCategoryWiseProduct("GI Drugs")).earnings;
        let AntifungalEarnings = (await fetchCategoryWiseProduct("Antifungals")).earnings;
        let AnalgesicEarnings = (await fetchCategoryWiseProduct("Analgesics")).earnings;
        let CVEarnings = (await fetchCategoryWiseProduct("CV Drugs")).earnings;
        let CNSEarnings = (await fetchCategoryWiseProduct("CNS Drugs")).earnings;
        let RespiratoryEarnings = (await fetchCategoryWiseProduct("Respiratory Drugs")).earnings;
        let EndocrineEarnings = (await fetchCategoryWiseProduct("Endocrine Drugs")).earnings;
        let DermatologicalEarnings = (await fetchCategoryWiseProduct("Dermatologicals")).earnings;
        let SupplyEarnings = (await fetchCategoryWiseProduct("Supplies")).earnings;

        let earnings = {
            totalEarnings,
            AntimicrobialEarnings,
            GIEarnings,
            AntifungalEarnings,
            AnalgesicEarnings,
            CVEarnings,
            CNSEarnings,
            RespiratoryEarnings,
            EndocrineEarnings,
            DermatologicalEarnings,
            SupplyEarnings,
        };

        let AntimicrobialCosts = (await fetchCategoryWiseProduct("Antimicrobials")).costs;
        let GICosts = (await fetchCategoryWiseProduct("GI Drugs")).costs;
        let AntifungalCosts = (await fetchCategoryWiseProduct("Antifungals")).costs;
        let AnalgesicCosts = (await fetchCategoryWiseProduct("Analgesics")).costs;
        let CVCosts = (await fetchCategoryWiseProduct("CV Drugs")).costs;
        let CNSCosts = (await fetchCategoryWiseProduct("CNS Drugs")).costs;
        let RespiratoryCosts = (await fetchCategoryWiseProduct("Respiratory Drugs")).costs;
        let EndocrineCosts = (await fetchCategoryWiseProduct("Endocrine Drugs")).costs;
        let DermatologicalCosts = (await fetchCategoryWiseProduct("Dermatologicals")).costs;
        let SupplyCosts = (await fetchCategoryWiseProduct("Supplies")).costs;

        let costs = {
            totalCosts,
            AntimicrobialCosts,
            GICosts,
            AntifungalCosts,
            AnalgesicCosts,
            CVCosts,
            CNSCosts,
            RespiratoryCosts,
            EndocrineCosts,
            DermatologicalCosts,
            SupplyCosts,
        };
        

        res.json({earnings:earnings, costs:costs});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

async function fetchCategoryWiseProduct(category){
    let earnings = 0;
    let costs = 0;
    let categoryOrders = await Order.find({
        "products.product.category": category,
    });

    for(let i=0; i<categoryOrders.length; i++){
        for (let j=0; j<categoryOrders[i].products.length; j++){
                earnings += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].product.price;
                costs += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].product.cost;
        }
    }
    return {earnings:earnings, costs:costs};
     
    
}

// update user verfication

adminRouter.put('/admin/update-user-verification', admin, async (req, res) => {
    try {
        
        const {id,verification} = req.body;
       let user = await User.findByIdAndUpdate(id); 
       user.verification = verification;
       
       user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
    
});

// Delete User

adminRouter.post('/admin/delete-user', admin, async (req, res) => {
    try {
        
        const {id} = req.body;
       let user = await User.findByIdAndDelete(id);
       
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
    
});
module.exports = adminRouter;
