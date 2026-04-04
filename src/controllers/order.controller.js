const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Address = require("../models/address.model");
const ApiError = require("../utils/apiError")
const ApiResponse = require("../utils/ApiResponse")
const asyncHandler = require("../utils/asyncHandler");


exports.createOrder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { addressId, paymentMethod = "cod" } = req.body;

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      throw new ApiError(404, "Address not found")
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.item");

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty")
    }

    const orderItems = cart.items.map((i) => ({
      item: i.item._id,
      name: i.item.title,
      price: i.price,
      quantity: i.quantity,
      image: i.item.image?.url,
    }));

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      paymentMethod,

      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
    })

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    res.json(new ApiResponse(201, "Order plased Successfully", order))
});