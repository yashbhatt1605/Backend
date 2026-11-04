const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        amount: {
            type: Number,
            required: true,
        },

        method: {
            type: String,
            enum: ["UPI", "Card", "Cash", "Net Banking"],
        },

        status: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Payment", paymentSchema);