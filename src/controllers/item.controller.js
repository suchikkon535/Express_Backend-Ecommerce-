const Item = require('../models/item.model');

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find().select("title price image");
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.createItem = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = `uploads/${req.file.filename}`;

    const item = await Item.create({
      user: req.user._id,
      title,
      description,
      price,
      image: imageUrl,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserItems = async (req, res) => { 
   try {
    const items = await Item.find({ user: req.user._id }).select("title price image");
    res.json(items)
   } catch (error) {
    res.status(500).json({ message: error.message });
   }
}

exports.itemInfo = async (req, res) => {
    try {
        const item = await Item.findById(req.body.id)

        if (!item) {
            return res.json({ message: "Item not found" });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}