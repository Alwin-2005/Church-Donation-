const merch = require("../../models/merchandise");
const mongoose = require("mongoose");

async function handleAddNewMerchItem(req, res) {
    const { itemName, category, price, stockQuantity, description, url, status } = req.body;

    try {
        await merch.create({
            itemName,
            category,
            price,
            stockQuantity,
            description,
            url: url || "",
            status: status || "visible",
        });
        return res.status(201).json({ msg: "Merchandise item created successfully" });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Failed to create merchandise item", error: err.message });
    }
}

async function handleGetAllMerchItems(req, res) {
    try {
        const result = await merch.find({});
        return res.status(200).json({ result });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Failed to fetch merchandise items", error: err.message });
    }
}

async function handleUpdateMerch(req, res) {
    try {
        const Result = await merch.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!Result) {
            return res.status(404).json({ msg: "Merchandise item not found" });
        }

        return res.status(200).json({ Result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Failed to update merchandise item", error: err.message });
    }
}

async function handleDeleteMerch(req, res) {
    try {
        const Result = await merch.findByIdAndDelete(req.params.id);

        if (!Result) {
            return res.status(404).json({ msg: "Merchandise item not found" });
        }

        return res.status(200).json({ msg: "Merchandise item deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Failed to delete merchandise item", error: err.message });
    }
}

module.exports = {
    handleAddNewMerchItem,
    handleGetAllMerchItems,
    handleUpdateMerch,
    handleDeleteMerch,
};