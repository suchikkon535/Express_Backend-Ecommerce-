const mongoose = require("mongoose");
const Cart = require("../models/cart.model");
const Item = require("../models/item.model");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");


exports.addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { itemId, quantity } = req.body;

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid itemId");
  }

  const item = await Item.findById(itemId);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [
        {
          item: itemId,
          quantity,
          price: item.price,
        },
      ],
      totalItems: quantity,
      totalPrice: item.price * quantity,
    });

    return res.json(new ApiResponse(201, "Item added to cart", cart));
  }

  const existingItemIndex = cart.items.findIndex((i) =>
    i.item.equals(itemId)
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      item: itemId,
      quantity,
      price: item.price,
    });
  }

  cart.totalItems = cart.items.reduce((acc, i) => acc + i.quantity, 0);
  cart.totalPrice = cart.items.reduce(
    (acc, i) => acc + i.quantity * i.price,
    0
  );

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Cart updated", cart));
});

exports.userCartItems = asyncHandler(async (req, res) => {
  
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("items.item", "title description image.url")
    .select("items totalItems totalPrice createdAt");

  if (!cart) {
    return res.json(
      new ApiResponse(200, "Cart is empty", {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      })
    );
  }

  return res.json(
    new ApiResponse(200, "Retrieved Items", cart)
  );
});
