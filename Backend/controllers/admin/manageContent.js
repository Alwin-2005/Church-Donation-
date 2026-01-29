const content = require("../../models/content");
const mongoose = require("mongoose");

async function handleAddNewContent(req, res) {
    const { title, body, type, status, date, time, image, note } = req.body;
    const createdBy = new mongoose.Types.ObjectId(req.user._id);
    try {
        await content.create({
            title,
            body: body || note, // Map note to body if body is missing
            type: type || 'event',
            status: status || 'visible',
            date,
            time,
            image,
            createdBy,
        });
        return res.status(201).json({ msg: "Content created successfully" });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Error adding content", error: err.message });
    }
}

async function handleViewAllContent(req, res) {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const result = await content.find(filter).populate("createdBy", "fullname email");
        return res.status(200).json({ result });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Failed to fetch content" });
    }
}

async function handleUpdateContent(req, res) {
    try {
        const Result = await content.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!Result) {
            return res.status(404).json({ msg: "Content not found" });
        }

        return res.status(200).json({ Result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Failed to update content", error: err.message });
    }
}

async function handleDeleteContent(req, res) {
    try {
        const Result = await content.findByIdAndDelete(req.params.id);
        if (!Result) {
            return res.status(404).json({ msg: "Content not found" });
        }
        return res.status(200).json({ msg: "Content deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Failed to delete content" });
    }
}

module.exports = {
    handleAddNewContent,
    handleViewAllContent,
    handleUpdateContent,
    handleDeleteContent,
};