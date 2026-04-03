const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            minlength: 3,
        },
        description: {
            type: String,
            required: true,
            minlength: 20,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("item", itemSchema);