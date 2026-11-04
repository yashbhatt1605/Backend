const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
    {
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        engine: {
            type: String,
            required: true,
        },
        fuel: {
            type: String,
            required: true,
        },
        transmission: {
            type: String,
            default: "Manual",
        },
        color: {
            type: String,
            default: "",
        },
        topSpeed: {
            type: String,
            default: "",
        },
        fuelTank: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            default: "Available",
        },
        image: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Bike", bikeSchema);