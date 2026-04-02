const User = require("../models/user.model");
const Item = require("../models/item.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/ApiResponse");

// GET users
exports.getUsers = async (req, res) => {
  try {
    const user = await User.find().select("name email")
    res.json(new ApiResponse(200, "Users retrieved", user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REGISTER
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new ApiError(400, "Email already in use");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json(new ApiResponse(201, "User created", {
      name: user.name,
      email: user.email,
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  try {
    const id = (req.user._id)
    const { name, email, password } = req.body;

    if (!password || !name || !email) {
      throw new ApiError(400, 'Name, email and password are required');
    }

    await User.findByIdAndUpdate(id, { name, email, password }, {
      new: true,
    });

    res.json(new ApiResponse(200, "User updated"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const id = (req.user._id);

    if (!id) {
      throw new ApiError(400, 'User id not provided');
    }

    await Item.deleteMany({ user: id });
    await User.findByIdAndDelete(id);

    return res.json(new ApiResponse(200, "User deleted"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
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
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  );
};
