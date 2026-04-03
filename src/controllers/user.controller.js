const User = require("../models/user.model");
const Item = require("../models/item.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const cloudinary = require("../../config/cloudinary");

// GET users
exports.getUsers = asyncHandler(async (req, res) => {

  const user = await User.find().select("name email")
  res.json(new ApiResponse(200, "Users retrieved", user));
});

// REGISTER
exports.createUser = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    if (req.file?.filename && cloudinary?.uploader?.destroy) {
      await cloudinary.uploader.destroy(req.file.filename);
      console.log("file deleted");
    }

    throw new ApiError(400, "Email already in use");
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      url: req.file.path,
      public_id: req.file.filename,
    }
  });

  res.status(201).json(new ApiResponse(201, "User created", {
    name: user.name,
    email: user.email,
    avatar: user.avatar.url,
  }));

});

// UPDATE user
exports.updateUser = asyncHandler(async (req, res) => {
  const id = (req.user._id)
  const { name, email, password } = req.body;

  if (!password || !name || !email) {
    throw new ApiError(400, 'Name, email and password are required');
  }

  await User.findByIdAndUpdate(id, { name, email, password }, {
    new: true,
  });

  res.json(new ApiResponse(200, "User updated"));
});

// DELETE user
exports.deleteUser = asyncHandler(async (req, res) => {

  const id = (req.user._id);

  if (!id) {
    throw new ApiError(400, 'User id not provided');
  }

  await Item.deleteMany({ user: id });
  await User.findByIdAndDelete(id);

  return res.json(new ApiResponse(200, "User deleted"));
});

// LOGIN
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = user.generateJWT();

  return res.json(
    new ApiResponse(200, "Login successful", {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    })
  );
});

exports.getUsersByRole = async (req, res) => {
  try {
    const role = req.params.role.toLowerCase();
    const ROLES = ["user", "admin", "worker"];

    if (!ROLES.includes(role)) {
      throw new ApiError(400, "Invalid role");
    }

    const users = await User.find({ role }).select("name email role createdAt")

    return res.json(new ApiResponse(200, "Users retrieved", users));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
