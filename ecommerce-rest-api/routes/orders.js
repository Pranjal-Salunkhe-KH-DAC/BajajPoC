// backend/routes/orders.js (Final Corrected)
const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const { protect } = require("../middleware/auth");

// CREATE ROUTER
const router = express.Router();

// ------------------------------------------------------------------
// CREATE ORDER (POST /)
// ------------------------------------------------------------------
router.post("/", protect, async (req, res) => {
  try {
    console.log("USER:", req.user?._id || "NO USER");

    if (!req.user?._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { items, shippingAddress, paymentMethod } = req.body;
    console.log("PAYLOAD:", JSON.stringify(req.body, null, 2));

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items required" });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const productId = item.productId;

      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: `Invalid productId: ${productId}` });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${productId}` });
      }

      const qty = item.quantity > 0 ? item.quantity : 1;
      const price = item.price > 0 ? item.price : product.price;
      const itemTotal = qty * price;

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: qty,
        price: price,
        // FIX: Added image property for front-end display
        image: product.image, 
        total: itemTotal
      });

      totalAmount += itemTotal;

      if (product.stock < qty) {
        return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      }

      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -qty } });
    }

    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      payment: { method: paymentMethod || "COD", status: "Pending" },
      
      // FIX: Explicitly save all financial fields expected by the front-end
      subtotal: totalAmount, 
      shipping: 0,           
      tax: 0,
      total: totalAmount,    // Total paid / due
      
      orderStatus: "Pending"
    });

    await order.save();
    console.log("ORDER SAVED:", order._id);

    res.status(201).json({ order });
  } catch (error) {
    console.error("ORDER ERROR:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ------------------------------------------------------------------
//  GET ALL USER ORDERS (GET /)
// ------------------------------------------------------------------
router.get("/", protect, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ------------------------------------------------------------------
//  FIX: GET SINGLE ORDER BY ID (GET /:id) - Resolves 404 Error
// ------------------------------------------------------------------
router.get("/:id", protect, async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid order ID format" });
    }

    // Find the order by ID and ensure it belongs to the authenticated user
    const order = await Order.findOne({ 
        _id: orderId, 
        userId: req.user._id 
    });

    if (!order) {
      // Return 404 if the order is not found or doesn't belong to the user
      return res.status(404).json({ error: "Order not found" });
    }

    // Return the order object
    res.json({ order }); 
  } catch (error) {
    console.error("GET ORDER DETAILS ERROR:", error.message);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

// ------------------------------------------------------------------
//  ADD SUCCESS ROUTE (Must be defined LAST)
// ------------------------------------------------------------------
router.get("/success", (req, res) => {
  res.json({ message: "Order placed successfully!" });
});

module.exports = router;