const User = require("../models/user.model");
const Item = require("../models/item.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/ApiResponse");

// GET /admin-api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt");
    return res.json(new ApiResponse(200, "Users retrieved", users));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /admin-api/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id || !role) {
      throw new ApiError(400, "User id and role are required");
    }

    if (!["user", "admin", "worker"].includes(role)) {
      throw new ApiError(400, "Invalid role");
    }

    await User.findByIdAndUpdate(id, { role }, { new: true });

    return res.json(new ApiResponse(200, "User role updated"));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /admin-api/users/:id
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "User id is required");
    }

    await Item.deleteMany({ user: id });
    await User.findByIdAndDelete(id);

    return res.json(new ApiResponse(200, "User deleted"));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /admin-api/items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name email role");
    return res.json(new ApiResponse(200, "Items retrieved", items));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
