const cart = require("../models/cart");
const merch = require("../models/merchandise");
const mongoose = require("mongoose");

// Helper to calculate cart totals
const calculateTotals = (items) => {
    let subTotal = 0;
    let quantity = 0;
    items.forEach(item => {
        subTotal += item.price * item.quantity;
        quantity += item.quantity;
    });
    return { subTotal, totalPrice: subTotal, quantity };
};

async function handleAddToCart(req, res) {
    const { itemId, quantity, price } = req.body;
    const userId = req.user._id;

    try {
        let userCart = await cart.findOne({ userId, status: "active" });

        if (!userCart) {
            userCart = await cart.create({
                userId,
                items: [{ itemId, quantity, price }],
                status: "active",
                ...calculateTotals([{ price, quantity }])
            });
            return res.status(201).json({ msg: "Cart created and item added", result: userCart });
        }

        // Check if item already exists in cart
        const itemIndex = userCart.items.findIndex(item => item.itemId.toString() === itemId);

        if (itemIndex > -1) {
            // Update quantity if item exists
            userCart.items[itemIndex].quantity += quantity;
        } else {
            // Add new item if it doesn't exist
            userCart.items.push({ itemId, quantity, price });
        }

        // Recalculate totals
        const totals = calculateTotals(userCart.items);
        userCart.subTotal = totals.subTotal;
        userCart.totalPrice = totals.totalPrice;
        userCart.quantity = totals.quantity;

        await userCart.save();
        return res.status(200).json({ msg: "Item added to cart", result: userCart });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error adding to cart" });
    }
}

async function handleGetCartInfo(req, res) {
    try {
        const result = await cart.findOne({ userId: req.user._id, status: "active" })
            .populate("items.itemId");

        if (!result) {
            return res.status(200).json({ items: [], totalPrice: 0, quantity: 0 });
        }
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error fetching cart" });
    }
}

async function handleUpdateCart(req, res) {
    const { itemId, quantity } = req.body;
    const userId = req.user._id;

    try {
        const userCart = await cart.findOne({ userId, status: "active" });
        if (!userCart) return res.status(404).json({ msg: "Cart not found" });

        const itemIndex = userCart.items.findIndex(item => item.itemId.toString() === itemId);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                // Remove item if quantity is zero or less
                userCart.items.splice(itemIndex, 1);
            } else {
                // Update quantity
                userCart.items[itemIndex].quantity = quantity;
            }

            // Recalculate totals
            const totals = calculateTotals(userCart.items);
            userCart.subTotal = totals.subTotal;
            userCart.totalPrice = totals.totalPrice;
            userCart.quantity = totals.quantity;

            await userCart.save();
            return res.status(200).json({ msg: "Cart updated successfully", result: userCart });
        } else {
            return res.status(404).json({ msg: "Item not found in cart" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error updating cart" });
    }
}

async function handleClearCart(userId) {
    try {
        await cart.findOneAndUpdate({ userId, status: "active" }, { status: "checkedout" });
    } catch (err) {
        console.error("Failed to clear cart in backend:", err);
    }
}

module.exports = {
    handleAddToCart,
    handleGetCartInfo,
    handleUpdateCart,
    handleClearCart
};

