const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
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
        year: { type: Number, min: 1886, max: 2100 },
        type: { type: String, default: "" },
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
        seats: {
            type: Number,
            default: 5,
        },
        mileage: {
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

module.exports = mongoose.model("Car", carSchema);