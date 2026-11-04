const Bike = require("../models/Bike");

// Get All Bikes
exports.getBikes = async (req, res) => {
    try {
        const bikes = await Bike.find().sort({ createdAt: -1 });
        res.status(200).json(bikes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bikes",
            error: error.message,
        });
    }
};

// Get Single Bike
exports.getBikeById = async (req, res) => {
    try {
        const bike = await Bike.findById(req.params.id);

        if (!bike) {
            return res.status(404).json({
                message: "Bike not found",
            });
        }

        res.status(200).json(bike);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Add Bike
exports.createBike = async (req, res) => {
    try {
        const bike = new Bike(req.body);

        await bike.save();

        res.status(201).json(bike);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

// Update Bike
exports.updateBike = async (req, res) => {
    try {
        const bike = await Bike.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!bike) {
            return res.status(404).json({
                message: "Bike not found",
            });
        }

        res.status(200).json(bike);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

// Delete Bike
exports.deleteBike = async (req, res) => {
    try {
        const bike = await Bike.findByIdAndDelete(req.params.id);

        if (!bike) {
            return res.status(404).json({
                message: "Bike not found",
            });
        }

        res.status(200).json({
            message: "Bike deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};