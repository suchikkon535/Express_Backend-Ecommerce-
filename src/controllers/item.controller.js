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
    console.log(req.file);

    const item = await Item.create({
      title,
      description,
      price,
      user: req.user._id,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
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