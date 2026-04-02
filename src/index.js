const express = require("express")
const cors = require("cors");
const path = require("path");

const indexRoutes = require("./routes/index.routes")
const userRoutes = require("./routes/user.routes")
const itemRoutes = require("./routes/item.routes")
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());

app.use(express.json())

app.use("/", indexRoutes)
app.use("/users", userRoutes)
app.use("/items", itemRoutes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(errorHandler);

module.exports = app