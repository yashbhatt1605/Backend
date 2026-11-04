const Car = require("../models/Car");

// Get All Cars
exports.getCars = async (req, res) => {
    try {
        const cars = await Car.find().sort({ createdAt: -1 });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch cars",
            error: error.message,
        });
    }
};

// Get Single Car
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                message: "Car not found",
            });
        }

        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Add Car
exports.createCar = async (req, res) => {
    try {
        const car = new Car(req.body);

        await car.save();

        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

// Update Car
exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!car) {
            return res.status(404).json({
                message: "Car not found",
            });
        }

        res.status(200).json(car);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

// Delete Car
exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);

        if (!car) {
            return res.status(404).json({
                message: "Car not found",
            });
        }

        res.status(200).json({
            message: "Car deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};