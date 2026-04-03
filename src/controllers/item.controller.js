const Item = require('../models/item.model');
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require('../utils/asyncHandler');

exports.getAllItems = asyncHandler(async (req, res) => {

  const items = await Item.find().select("title price image");
  res.json(new ApiResponse(200, "Items Retrived"), items);

});

exports.createItem = asyncHandler(async (req, res) => {
  const { title, description, price } = req.body;

  const item = await Item.create({
    user: req.user._id,
    title,
    description,
    price,
    image: {
      url: req.file.path,
      public_id: req.file.filename,
    },
  });

  res.json(new ApiResponse(201, "Item created", item));
});

exports.getUserItems = asyncHandler(async (req, res) => {

  const items = await Item.find({ user: req.user._id }).select("title price image");
  res.json(items)

});

exports.itemInfo = asyncHandler(async (req, res) => {

  const item = await Item.findById(req.body.id)

  if (!item) {
    return res.json({ message: "Item not found" });
  }

  res.json(item);

});